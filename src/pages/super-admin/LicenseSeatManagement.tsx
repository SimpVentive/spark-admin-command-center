import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Users, AlertTriangle, TrendingUp, AlertCircle, Settings2, Plus,
  Percent, ArrowUpRight, Info, X
} from "lucide-react";

// ====== TYPES ======
interface SeatBlock {
  id: string;
  label: string;
  name: string;
  seat_from: number;
  seat_to: number;
  rate_per_seat: number;
  annual_rate_per_seat: number | null;
  incremental_rate: number;
  notes: string | null;
}

interface CompanySeatData {
  id: string;
  company_id: string;
  company_name: string;
  block_id: string | null;
  block_seats: number;
  incremental_seats: number;
  incremental_rate: number | null;
  active_users: number;
  discount_percent: number;
  discount_target: string;
  discount_reason: string | null;
  discount_valid_until: string | null;
}

interface CompanyDiscount {
  id: string;
  company_id: string;
  company_name?: string;
  discount_target: string;
  discount_percent: number;
  valid_until: string | null;
  reason: string | null;
  notes: string | null;
}

// ====== HELPERS ======
const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function getBlockRate(block: SeatBlock | undefined, seats: number) {
  if (!block) return 0;
  return block.rate_per_seat * seats;
}

function getIncrRate(block: SeatBlock | undefined, companyRate: number | null) {
  if (companyRate && companyRate > 0) return companyRate;
  return block?.incremental_rate || 0;
}

// ====== MAIN COMPONENT ======
export default function LicenseSeatManagement() {
  const { toast } = useToast();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [blockFilter, setBlockFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [blockConfigOpen, setBlockConfigOpen] = useState(false);
  const [addSeatsOpen, setAddSeatsOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [editBlockOpen, setEditBlockOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<SeatBlock | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  // ====== QUERIES ======
  const { data: blocks = [] } = useQuery({
    queryKey: ["seat-blocks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seat_blocks")
        .select("*")
        .order("seat_from");
      if (error) throw error;
      return data as SeatBlock[];
    },
  });

  const { data: companies = [] } = useQuery({
    queryKey: ["sa-companies-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("companies").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["seat-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_payments")
        .select("id, company_id, block_id, block_seats, incremental_seats, incremental_rate, active_users, discount_percent, discount_target, discount_reason, discount_valid_until, plan_status")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: discounts = [] } = useQuery({
    queryKey: ["company-discounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_discounts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as CompanyDiscount[];
    },
  });

  // ====== DERIVED DATA ======
  // Get latest payment per company (seat allocation)
  const companySeatMap = new Map<string, any>();
  payments.forEach((p: any) => {
    if (!companySeatMap.has(p.company_id)) {
      companySeatMap.set(p.company_id, p);
    }
  });

  const seatData: CompanySeatData[] = companies.map((c: any) => {
    const p = companySeatMap.get(c.id);
    return {
      id: p?.id || c.id,
      company_id: c.id,
      company_name: c.name,
      block_id: p?.block_id || null,
      block_seats: p?.block_seats || 0,
      incremental_seats: p?.incremental_seats || 0,
      incremental_rate: p?.incremental_rate || null,
      active_users: p?.active_users || 0,
      discount_percent: p?.discount_percent || 0,
      discount_target: p?.discount_target || "block",
      discount_reason: p?.discount_reason || null,
      discount_valid_until: p?.discount_valid_until || null,
    };
  }).filter((s) => s.block_id);

  const totalLicensedSeats = seatData.reduce((s, c) => s + c.block_seats, 0);
  const totalIncrSeats = seatData.reduce((s, c) => s + c.incremental_seats, 0);
  const totalIncrBilling = seatData.reduce((s, c) => {
    const blk = blocks.find((b) => b.id === c.block_id);
    return s + c.incremental_seats * getIncrRate(blk, c.incremental_rate);
  }, 0);

  const overBlockCompanies = seatData.filter((c) => {
    const blk = blocks.find((b) => b.id === c.block_id);
    if (!blk) return false;
    return c.active_users > c.block_seats + c.incremental_seats;
  });

  const nearNextBlock = seatData.filter((c) => {
    const blk = blocks.find((b) => b.id === c.block_id);
    if (!blk) return false;
    const nextBlk = blocks.find((b) => b.seat_from > blk.seat_to);
    if (!nextBlk) return false;
    const totalSeats = c.block_seats + c.incremental_seats;
    return totalSeats > 0 && (nextBlk.seat_from - totalSeats) <= 20;
  });

  // ====== FILTER ======
  const filteredSeatData = seatData.filter((c) => {
    if (blockFilter !== "all" && c.block_id !== blockFilter) return false;
    if (statusFilter === "has_incremental" && c.incremental_seats <= 0) return false;
    if (statusFilter === "near_next" && !nearNextBlock.find((n) => n.company_id === c.company_id)) return false;
    if (statusFilter === "over_block" && !overBlockCompanies.find((n) => n.company_id === c.company_id)) return false;
    if (statusFilter === "in_block" && c.incremental_seats > 0) return false;
    return true;
  });

  const withIncr = seatData.filter((c) => c.incremental_seats > 0);
  const withDiscount = seatData.filter((c) => c.discount_percent > 0);

  // ====== RENDER ======
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            License & Seat Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Block-based seat pricing, per-company incremental allocations, discounts, and upsell intelligence
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBlockConfigOpen(true)}>
            <Settings2 className="h-4 w-4 mr-1" /> Manage Blocks
          </Button>
          <Button onClick={() => setAddSeatsOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Seats
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {overBlockCompanies.length > 0 && !dismissedAlerts.includes("overage") && (
        <Alert variant="destructive" className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{overBlockCompanies.length} companies</strong> exceeded their block.{" "}
              {overBlockCompanies.slice(0, 2).map((c) => c.company_name).join(" and ")}. Incremental seats being billed at ad-hoc rate.
            </AlertDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDismissedAlerts([...dismissedAlerts, "overage"])}>
            <X className="h-3 w-3" />
          </Button>
        </Alert>
      )}
      {nearNextBlock.length > 0 && !dismissedAlerts.includes("upsell") && (
        <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-950/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-300">
              <strong>{nearNextBlock.length} companies</strong> have incremental seats within 20 of the next block threshold — upgrade opportunity.
            </AlertDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDismissedAlerts([...dismissedAlerts, "upsell"])}>
            <X className="h-3 w-3" />
          </Button>
        </Alert>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Users} label="Total Licensed Seats" value={totalLicensedSeats.toLocaleString()} sub={`Across ${seatData.length} companies`} color="text-primary" bgColor="bg-primary/10" />
        <KPICard icon={AlertCircle} label="Incremental Seats (total)" value={totalIncrSeats.toString()} sub={`${fmt(totalIncrBilling)} ad-hoc billing`} color="text-amber-600" bgColor="bg-amber-100 dark:bg-amber-900/20" />
        <KPICard icon={TrendingUp} label="Near Next Block (≤20 seats)" value={nearNextBlock.length.toString()} sub="Upsell opportunity" color="text-emerald-600" bgColor="bg-emerald-100 dark:bg-emerald-900/20" />
        <KPICard icon={AlertTriangle} label="Over Block Limit" value={overBlockCompanies.length.toString()} sub="Action required" color="text-destructive" bgColor="bg-destructive/10" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Companies</TabsTrigger>
          <TabsTrigger value="incremental">
            Incremental Seats <Badge variant="secondary" className="ml-1.5 text-xs">{totalIncrSeats} seats</Badge>
          </TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
          <TabsTrigger value="overages">
            Overages <Badge variant="destructive" className="ml-1.5 text-xs">{overBlockCompanies.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="upsell">Upsell Calculator</TabsTrigger>
        </TabsList>

        {/* ALL COMPANIES TAB */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Select value={blockFilter} onValueChange={setBlockFilter}>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Blocks" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blocks</SelectItem>
                    {blocks.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.label} ({b.seat_from}–{b.seat_to === 999999 ? "∞" : b.seat_to})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_block">In Block</SelectItem>
                    <SelectItem value="has_incremental">Has Incremental</SelectItem>
                    <SelectItem value="near_next">Near Next Block</SelectItem>
                    <SelectItem value="over_block">Over Block</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Block Seats</TableHead>
                    <TableHead>Incremental Seats</TableHead>
                    <TableHead>Active Users</TableHead>
                    <TableHead>Seat Usage</TableHead>
                    <TableHead>Block Rate</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSeatData.length === 0 ? (
                    <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No companies match filters</TableCell></TableRow>
                  ) : (
                    filteredSeatData.map((c) => {
                      const blk = blocks.find((b) => b.id === c.block_id);
                      const totalSeats = c.block_seats + c.incremental_seats;
                      const usagePct = totalSeats > 0 ? Math.min(100, Math.round((c.active_users / totalSeats) * 100)) : 0;
                      const isOver = c.active_users > totalSeats;
                      return (
                        <TableRow key={c.company_id}>
                          <TableCell className="font-medium">{c.company_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{blk?.label} · {blk?.seat_from}–{blk?.seat_to === 999999 ? "∞" : blk?.seat_to}</Badge>
                          </TableCell>
                          <TableCell>{c.block_seats}</TableCell>
                          <TableCell>
                            {c.incremental_seats > 0 ? (
                              <span className="text-amber-600 font-medium">+{c.incremental_seats} seats</span>
                            ) : "None"}
                          </TableCell>
                          <TableCell>{c.active_users}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <Progress value={usagePct} className={`h-2 ${isOver ? "[&>div]:bg-destructive" : usagePct > 90 ? "[&>div]:bg-amber-500" : ""}`} />
                              <span className={`text-xs font-medium ${isOver ? "text-destructive" : ""}`}>{usagePct}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{fmt(blk?.rate_per_seat || 0)}/seat</TableCell>
                          <TableCell>{c.discount_percent > 0 ? <Badge variant="secondary">{c.discount_percent}% off</Badge> : "—"}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => { setAddSeatsOpen(true); }}>+ Seats</Button>
                              <Button variant="ghost" size="sm" onClick={() => setDiscountOpen(true)}>Discount</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              <p className="text-xs text-muted-foreground mt-3">Showing {filteredSeatData.length} of {seatData.length} companies</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* INCREMENTAL SEATS TAB */}
        <TabsContent value="incremental">
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Incremental seats are allocated <strong>outside</strong> a company's block. They are billed at the company's assigned incremental rate (default: ad-hoc rate). Moving to the next block may be more cost-effective for many of these companies.
            </AlertDescription>
          </Alert>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Current Block</TableHead>
                    <TableHead>Block Seats</TableHead>
                    <TableHead>Incremental</TableHead>
                    <TableHead>Incr. Rate</TableHead>
                    <TableHead>Monthly Incr. Cost</TableHead>
                    <TableHead>Next Block At</TableHead>
                    <TableHead>Savings if Upgraded</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withIncr.length === 0 ? (
                    <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No companies with incremental seats</TableCell></TableRow>
                  ) : (
                    withIncr.map((c) => {
                      const blk = blocks.find((b) => b.id === c.block_id);
                      const rate = getIncrRate(blk, c.incremental_rate);
                      const incrCost = c.incremental_seats * rate;
                      const nextBlk = blocks.find((b) => b.seat_from > (blk?.seat_to || 0));
                      const gap = nextBlk ? nextBlk.seat_from - (c.block_seats + c.incremental_seats) : null;
                      const isNear = gap !== null && gap <= 20;

                      // Calculate savings if upgraded
                      const currentTotal = (blk?.rate_per_seat || 0) * c.block_seats + incrCost;
                      const upgradeTotal = nextBlk ? nextBlk.rate_per_seat * (c.block_seats + c.incremental_seats) : currentTotal;
                      const saving = currentTotal - upgradeTotal;

                      return (
                        <TableRow key={c.company_id}>
                          <TableCell className="font-medium">{c.company_name}</TableCell>
                          <TableCell><Badge variant="outline">{blk?.label}</Badge></TableCell>
                          <TableCell>{c.block_seats}</TableCell>
                          <TableCell><span className="text-amber-600 font-medium">+{c.incremental_seats} seats</span></TableCell>
                          <TableCell>
                            {fmt(rate)}/seat
                            {c.incremental_rate ? <span className="text-xs text-muted-foreground block">custom</span> : ""}
                          </TableCell>
                          <TableCell className="font-medium">{fmt(incrCost)}</TableCell>
                          <TableCell>
                            {nextBlk ? (
                              <span className={isNear ? "text-emerald-600 font-medium" : ""}>
                                {gap} seats away {isNear ? "⚡" : ""}
                              </span>
                            ) : "Max block"}
                          </TableCell>
                          <TableCell>
                            {saving > 0 ? (
                              <span className="text-emerald-600 font-medium">Saves {fmt(saving)}/mo</span>
                            ) : "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => setAddSeatsOpen(true)}>Manage</Button>
                              {isNear && <Button variant="ghost" size="sm" className="text-emerald-600">Propose Upgrade</Button>}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DISCOUNTS TAB */}
        <TabsContent value="discounts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Company-Specific Discounts</CardTitle>
                <CardDescription>Override block pricing for specific companies — strategic accounts, long-term contracts, or promotional deals</CardDescription>
              </div>
              <Button size="sm" onClick={() => setDiscountOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add Discount
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Standard Block Price</TableHead>
                    <TableHead>Discount %</TableHead>
                    <TableHead>Discounted Price</TableHead>
                    <TableHead>Annual Saving</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withDiscount.length === 0 ? (
                    <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No company discounts configured</TableCell></TableRow>
                  ) : (
                    withDiscount.map((c) => {
                      const blk = blocks.find((b) => b.id === c.block_id);
                      const base = (blk?.rate_per_seat || 0) * c.block_seats;
                      const discAmt = Math.round(base * c.discount_percent / 100);
                      const discounted = base - discAmt;
                      const annualSaving = discAmt * 12;
                      return (
                        <TableRow key={c.company_id}>
                          <TableCell className="font-medium">{c.company_name}</TableCell>
                          <TableCell><Badge variant="outline">{blk?.label}</Badge></TableCell>
                          <TableCell>{fmt(base)}/mo</TableCell>
                          <TableCell><Badge variant="secondary">{c.discount_percent}%</Badge></TableCell>
                          <TableCell className="font-medium">{fmt(discounted)}/mo</TableCell>
                          <TableCell className="text-emerald-600">{fmt(annualSaving)}</TableCell>
                          <TableCell>{c.discount_valid_until || "—"}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{c.discount_reason || "—"}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OVERAGES TAB */}
        <TabsContent value="overages">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Companies Exceeding Block Capacity</CardTitle>
                <CardDescription>Users active beyond block + incremental seat allocation</CardDescription>
              </div>
              <Button size="sm" onClick={() => toast({ title: "Overage invoices generated" })}>Bill All Overages</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Total Seats</TableHead>
                    <TableHead>Active Users</TableHead>
                    <TableHead>Overage</TableHead>
                    <TableHead>Est. Charge</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overBlockCompanies.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No companies exceeding block capacity 🎉</TableCell></TableRow>
                  ) : (
                    overBlockCompanies.map((c) => {
                      const blk = blocks.find((b) => b.id === c.block_id);
                      const total = c.block_seats + c.incremental_seats;
                      const overage = c.active_users - total;
                      const rate = getIncrRate(blk, c.incremental_rate);
                      const charge = overage * rate;
                      return (
                        <TableRow key={c.company_id}>
                          <TableCell className="font-medium">{c.company_name}</TableCell>
                          <TableCell><Badge variant="outline">{blk?.label}</Badge></TableCell>
                          <TableCell>{total}</TableCell>
                          <TableCell className="text-destructive font-medium">{c.active_users}</TableCell>
                          <TableCell><Badge variant="destructive">+{overage} seats</Badge></TableCell>
                          <TableCell className="font-medium">{fmt(charge)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm" onClick={() => toast({ title: `Billed ${fmt(charge)} to ${c.company_name}` })}>
                                Bill {fmt(charge)}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setAddSeatsOpen(true)}>Add Seats</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UPSELL CALCULATOR TAB */}
        <TabsContent value="upsell">
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              This calculator shows the revenue impact and customer savings of upgrading a company to the next block. Share the "Customer View" with your CSM to use in renewal conversations.
            </AlertDescription>
          </Alert>
          <Card>
            <CardHeader>
              <CardTitle>Block Upgrade Calculator</CardTitle>
              <CardDescription>Companies near or beyond their block threshold</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Current Block</TableHead>
                    <TableHead>Current Cost/mo</TableHead>
                    <TableHead>Next Block</TableHead>
                    <TableHead>Next Block Cost/mo</TableHead>
                    <TableHead>Savings/mo</TableHead>
                    <TableHead>Gap to Next Block</TableHead>
                    <TableHead>Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seatData.filter((c) => c.incremental_seats > 0 || nearNextBlock.find((n) => n.company_id === c.company_id)).length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No upgrade opportunities found</TableCell></TableRow>
                  ) : (
                    seatData
                      .filter((c) => c.incremental_seats > 0 || nearNextBlock.find((n) => n.company_id === c.company_id))
                      .map((c) => {
                        const blk = blocks.find((b) => b.id === c.block_id);
                        const nextBlk = blocks.find((b) => b.seat_from > (blk?.seat_to || 0));
                        const totalSeats = c.block_seats + c.incremental_seats;
                        const rate = getIncrRate(blk, c.incremental_rate);
                        const currCost = (blk?.rate_per_seat || 0) * c.block_seats + c.incremental_seats * rate;
                        const newCost = nextBlk ? nextBlk.rate_per_seat * totalSeats : currCost;
                        const diff = currCost - newCost;
                        const gap = nextBlk ? nextBlk.seat_from - totalSeats : 0;
                        const isUpgrade = diff > 0;

                        return (
                          <TableRow key={c.company_id}>
                            <TableCell className="font-medium">{c.company_name}</TableCell>
                            <TableCell><Badge variant="outline">{blk?.label}</Badge></TableCell>
                            <TableCell>{fmt(currCost)}</TableCell>
                            <TableCell>{nextBlk ? <Badge variant="outline">{nextBlk.label}</Badge> : "—"}</TableCell>
                            <TableCell>{nextBlk ? fmt(newCost) : "—"}</TableCell>
                            <TableCell>
                              {isUpgrade ? (
                                <span className="text-emerald-600 font-medium flex items-center gap-1">
                                  <ArrowUpRight className="h-3 w-3" /> Saves {fmt(diff)}
                                </span>
                              ) : nextBlk ? (
                                <span className="text-muted-foreground">{fmt(Math.abs(diff))} more</span>
                              ) : "—"}
                            </TableCell>
                            <TableCell>{gap <= 0 ? "Exceeded" : `${gap} seats`}</TableCell>
                            <TableCell>
                              {isUpgrade ? (
                                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                  💡 Recommend upgrade
                                </Badge>
                              ) : ""}
                            </TableCell>
                          </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ====== MODALS ====== */}
      <BlockConfigModal
        open={blockConfigOpen}
        onOpenChange={setBlockConfigOpen}
        blocks={blocks}
        onEditBlock={(b) => { setEditingBlock(b); setEditBlockOpen(true); }}
        onRefresh={() => qc.invalidateQueries({ queryKey: ["seat-blocks"] })}
      />
      <EditBlockModal
        open={editBlockOpen}
        onOpenChange={setEditBlockOpen}
        block={editingBlock}
        onRefresh={() => qc.invalidateQueries({ queryKey: ["seat-blocks"] })}
      />
      <AddSeatsModal
        open={addSeatsOpen}
        onOpenChange={setAddSeatsOpen}
        companies={companies}
        blocks={blocks}
        seatData={seatData}
        userId={user?.id || ""}
        onRefresh={() => qc.invalidateQueries({ queryKey: ["seat-payments"] })}
      />
      <DiscountModal
        open={discountOpen}
        onOpenChange={setDiscountOpen}
        companies={companies}
        blocks={blocks}
        seatData={seatData}
        userId={user?.id || ""}
        onRefresh={() => {
          qc.invalidateQueries({ queryKey: ["seat-payments"] });
          qc.invalidateQueries({ queryKey: ["company-discounts"] });
        }}
      />
    </div>
  );
}

// ====== KPI CARD ======
function KPICard({ icon: Icon, label, value, sub, color, bgColor }: {
  icon: any; label: string; value: string; sub: string; color: string; bgColor: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${bgColor}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold leading-none mt-0.5">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ====== BLOCK CONFIG MODAL ======
function BlockConfigModal({ open, onOpenChange, blocks, onEditBlock, onRefresh }: {
  open: boolean; onOpenChange: (v: boolean) => void; blocks: SeatBlock[];
  onEditBlock: (b: SeatBlock | null) => void; onRefresh: () => void;
}) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("seat_blocks").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Block deleted" });
    onRefresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Seat Block Configuration</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">
          Define the seat blocks your platform offers. Each block has a range, per-seat rate, and incremental rate. Clients are assigned to a block; incremental seats beyond the block are billed separately.
        </p>
        <div className="space-y-3 max-h-[400px] overflow-auto">
          {blocks.map((b) => (
            <div key={b.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{b.id}</Badge>
                  <span className="font-medium">{b.seat_from}–{b.seat_to === 999999 ? "∞" : b.seat_to}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {b.name} · Per Seat / Month · {fmt(b.rate_per_seat)}/seat/mo
                </p>
                <p className="text-xs text-muted-foreground">Default incr. rate: {fmt(b.incremental_rate)}/seat</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => onEditBlock(b)}>Edit</Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(b.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { onEditBlock(null); }}>
            <Plus className="h-4 w-4 mr-1" /> Add New Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ====== EDIT/ADD BLOCK MODAL ======
function EditBlockModal({ open, onOpenChange, block, onRefresh }: {
  open: boolean; onOpenChange: (v: boolean) => void; block: SeatBlock | null; onRefresh: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    id: "", label: "", name: "", seat_from: "", seat_to: "",
    rate_per_seat: "", incremental_rate: "", notes: "",
  });

  const isNew = !block;

  const resetForm = () => {
    if (block) {
      setForm({
        id: block.id, label: block.label, name: block.name,
        seat_from: block.seat_from.toString(), seat_to: block.seat_to === 999999 ? "" : block.seat_to.toString(),
        rate_per_seat: block.rate_per_seat.toString(), incremental_rate: block.incremental_rate.toString(),
        notes: block.notes || "",
      });
    } else {
      setForm({ id: "", label: "", name: "", seat_from: "", seat_to: "", rate_per_seat: "", incremental_rate: "", notes: "" });
    }
  };

  // Reset form when block changes
  useState(() => { resetForm(); });

  const handleSave = async () => {
    if (!form.id || !form.rate_per_seat) {
      toast({ title: "Block ID and rate are required", variant: "destructive" });
      return;
    }
    const payload = {
      id: form.id,
      label: form.label || `Block ${form.id}`,
      name: form.name || "Custom",
      seat_from: parseInt(form.seat_from) || 1,
      seat_to: form.seat_to ? parseInt(form.seat_to) : 999999,
      rate_per_seat: parseFloat(form.rate_per_seat) || 0,
      incremental_rate: parseFloat(form.incremental_rate) || 0,
      notes: form.notes || null,
    };

    const { error } = isNew
      ? await supabase.from("seat_blocks").insert(payload)
      : await supabase.from("seat_blocks").update(payload).eq("id", block!.id);

    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: isNew ? "Block created" : "Block updated" });
    onOpenChange(false);
    onRefresh();
  };

  // Preview calculations
  const rate = parseFloat(form.rate_per_seat) || 0;
  const from = parseInt(form.seat_from) || 0;
  const to = form.seat_to ? parseInt(form.seat_to) : from * 3;
  const mid = Math.round((from + to) / 2);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isNew ? "Add New Block" : `Edit ${block?.label}`}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-2">
          All blocks use tiered per-seat pricing — each block has its own rate per seat per month.
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Block ID *</Label>
              <Input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="e.g. B6" disabled={!isNew} />
            </div>
            <div>
              <Label>Block Name / Label</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Enterprise Plus" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Seat Range — From *</Label>
              <Input type="number" value={form.seat_from} onChange={(e) => setForm({ ...form, seat_from: e.target.value })} placeholder="First seat count" />
            </div>
            <div>
              <Label>Seat Range — To</Label>
              <Input type="number" value={form.seat_to} onChange={(e) => setForm({ ...form, seat_to: e.target.value })} placeholder="Leave blank for unlimited" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Rate per Seat / Month (₹) *</Label>
              <Input type="number" value={form.rate_per_seat} onChange={(e) => setForm({ ...form, rate_per_seat: e.target.value })} />
            </div>
            <div>
              <Label>Default Incremental Rate (₹/seat/month)</Label>
              <Input type="number" value={form.incremental_rate} onChange={(e) => setForm({ ...form, incremental_rate: e.target.value })} />
            </div>
          </div>

          {rate > 0 && from > 0 && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
              <p className="font-medium text-foreground">Monthly bill preview for this block</p>
              <p>At min seats: <strong>{fmt(from * rate)}/mo</strong></p>
              <p>At midpoint: <strong>{fmt(mid * rate)}/mo</strong></p>
              <p>At max seats: <strong>{fmt(to * rate)}/mo</strong></p>
            </div>
          )}

          <div>
            <Label>Internal Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Internal notes..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Block</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ====== ADD SEATS MODAL ======
function AddSeatsModal({ open, onOpenChange, companies, blocks, seatData, userId, onRefresh }: {
  open: boolean; onOpenChange: (v: boolean) => void; companies: any[]; blocks: SeatBlock[];
  seatData: CompanySeatData[]; userId: string; onRefresh: () => void;
}) {
  const { toast } = useToast();
  const [companyId, setCompanyId] = useState("");
  const [allocType, setAllocType] = useState<"incr" | "upgrade">("incr");
  const [seatCount, setSeatCount] = useState("10");
  const [incrRate, setIncrRate] = useState("599");
  const [reason, setReason] = useState("");
  const [upgradeBlockId, setUpgradeBlockId] = useState("");

  const selectedCompany = seatData.find((c) => c.company_id === companyId);
  const currentBlock = blocks.find((b) => b.id === selectedCompany?.block_id);
  const nextBlock = blocks.find((b) => b.seat_from > (currentBlock?.seat_to || 0));

  const addCost = (parseInt(seatCount) || 0) * (parseInt(incrRate) || 0);

  const handleSave = async () => {
    if (!companyId) { toast({ title: "Select a company", variant: "destructive" }); return; }

    if (allocType === "incr") {
      const newIncr = (selectedCompany?.incremental_seats || 0) + (parseInt(seatCount) || 0);
      const { error } = await supabase
        .from("company_payments")
        .update({
          incremental_seats: newIncr,
          incremental_rate: parseFloat(incrRate) || null,
        })
        .eq("id", selectedCompany?.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }

      // Log change
      await supabase.from("seat_change_log").insert({
        company_id: companyId,
        change_type: "add_incremental",
        details: { seats_added: parseInt(seatCount), rate: parseFloat(incrRate), reason },
        performed_by: userId,
      });
    } else {
      // Upgrade block
      const targetBlock = blocks.find((b) => b.id === upgradeBlockId) || nextBlock;
      if (!targetBlock) { toast({ title: "No upgrade block available", variant: "destructive" }); return; }
      const { error } = await supabase
        .from("company_payments")
        .update({
          block_id: targetBlock.id,
          block_seats: selectedCompany ? selectedCompany.block_seats + selectedCompany.incremental_seats : 0,
          incremental_seats: 0,
        })
        .eq("id", selectedCompany?.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }

      await supabase.from("seat_change_log").insert({
        company_id: companyId,
        change_type: "upgrade_block",
        details: { from_block: selectedCompany?.block_id, to_block: targetBlock.id, reason },
        performed_by: userId,
      });
    }

    toast({ title: "Seats added and billing updated" });
    onOpenChange(false);
    onRefresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Seats to Company</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Company</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger><SelectValue placeholder="Select company..." /></SelectTrigger>
              <SelectContent>
                {seatData.map((c) => {
                  const blk = blocks.find((b) => b.id === c.block_id);
                  return (
                    <SelectItem key={c.company_id} value={c.company_id}>
                      {c.company_name} ({blk?.label} · {c.block_seats} seats)
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedCompany && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
              <p>Current block: <strong>{currentBlock?.label}</strong></p>
              <p>Block seats: <strong>{selectedCompany.block_seats}</strong></p>
              <p>Current incremental seats: <strong>{selectedCompany.incremental_seats}</strong></p>
              <p>Active users: <strong>{selectedCompany.active_users}</strong></p>
              <p>Next block upgrade at: <strong>{nextBlock ? `${nextBlock.label} (${nextBlock.seat_from}+)` : "Max block"}</strong></p>
            </div>
          )}

          <div>
            <Label>Allocation Type</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <Button variant={allocType === "incr" ? "default" : "outline"} className="h-auto py-3" onClick={() => setAllocType("incr")}>
                <div className="text-left">
                  <p className="font-medium text-sm">Incremental Seats</p>
                  <p className="text-xs opacity-80">Added on top of current block</p>
                </div>
              </Button>
              <Button variant={allocType === "upgrade" ? "default" : "outline"} className="h-auto py-3" onClick={() => setAllocType("upgrade")}>
                <div className="text-left">
                  <p className="font-medium text-sm">Upgrade to Next Block</p>
                  <p className="text-xs opacity-80">Move to a higher block</p>
                </div>
              </Button>
            </div>
          </div>

          {allocType === "incr" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Number of Incremental Seats</Label>
                  <Input type="number" value={seatCount} onChange={(e) => setSeatCount(e.target.value)} min="1" />
                  <p className="text-xs text-muted-foreground mt-1">These sit on top of the company's block allocation</p>
                </div>
                <div>
                  <Label>Incremental Rate (₹/seat/month)</Label>
                  <Input type="number" value={incrRate} onChange={(e) => setIncrRate(e.target.value)} />
                  <p className="text-xs text-muted-foreground mt-1">Override this company's rate</p>
                </div>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
                <p className="font-medium">Additional monthly cost</p>
                <p className="text-xl font-bold text-primary">{fmt(addCost)}</p>
                <p className="text-xs text-muted-foreground">{seatCount} seats × ₹{incrRate}/seat/month</p>
              </div>
              {nextBlock && selectedCompany && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 text-sm">
                  <p className="font-medium text-emerald-800 dark:text-emerald-400">💡 Upgrade tip:</p>
                  <p className="text-emerald-700 dark:text-emerald-300 text-xs mt-1">
                    {nextBlock.label} — {nextBlock.seat_from}–{nextBlock.seat_to === 999999 ? "∞" : nextBlock.seat_to} seats @ {fmt(nextBlock.rate_per_seat)}/seat may be more cost-effective.
                  </p>
                </div>
              )}
            </>
          )}

          {allocType === "upgrade" && nextBlock && (
            <div>
              <Label>Upgrade to Block</Label>
              <Select value={upgradeBlockId || nextBlock?.id || ""} onValueChange={setUpgradeBlockId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {blocks.filter((b) => b.seat_from > (currentBlock?.seat_to || 0)).map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.label} — {b.seat_from}–{b.seat_to === 999999 ? "∞" : b.seat_to} seats @ {fmt(b.rate_per_seat)}/seat
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Reason for Addition</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. New batch of employees, department expansion..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Confirm & Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ====== DISCOUNT MODAL ======
function DiscountModal({ open, onOpenChange, companies, blocks, seatData, userId, onRefresh }: {
  open: boolean; onOpenChange: (v: boolean) => void; companies: any[]; blocks: SeatBlock[];
  seatData: CompanySeatData[]; userId: string; onRefresh: () => void;
}) {
  const { toast } = useToast();
  const [companyId, setCompanyId] = useState("");
  const [target, setTarget] = useState("block");
  const [discPct, setDiscPct] = useState("10");
  const [validUntil, setValidUntil] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = async () => {
    if (!companyId || !discPct) {
      toast({ title: "Company and discount % required", variant: "destructive" });
      return;
    }

    // Save to company_discounts table
    const { error: discError } = await supabase.from("company_discounts").insert({
      company_id: companyId,
      discount_target: target,
      discount_percent: parseFloat(discPct),
      valid_until: validUntil || null,
      reason: reason || null,
      notes: notes || null,
      created_by: userId,
    });
    if (discError) { toast({ title: "Error", description: discError.message, variant: "destructive" }); return; }

    // Also update company_payments
    const cp = seatData.find((c) => c.company_id === companyId);
    if (cp) {
      await supabase.from("company_payments").update({
        discount_percent: parseFloat(discPct),
        discount_target: target,
        discount_reason: reason || null,
        discount_valid_until: validUntil || null,
      }).eq("id", cp.id);
    }

    // Log
    await supabase.from("seat_change_log").insert({
      company_id: companyId,
      change_type: "discount_add",
      details: { discount_percent: parseFloat(discPct), target, reason, valid_until: validUntil },
      performed_by: userId,
    });

    toast({ title: "Discount applied" });
    onOpenChange(false);
    onRefresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Set Company Discount</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Company</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger><SelectValue placeholder="Select company..." /></SelectTrigger>
              <SelectContent>
                {companies.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Apply Discount To</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {["block", "incremental", "both"].map((t) => (
                <Button key={t} variant={target === t ? "default" : "outline"} size="sm" onClick={() => setTarget(t)}>
                  {t === "block" ? "Block Price" : t === "incremental" ? "Incremental Rate" : "Both"}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Discount %</Label>
              <div className="relative">
                <Input type="number" value={discPct} onChange={(e) => setDiscPct(e.target.value)} className="pr-8" />
                <Percent className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <Label>Valid Until</Label>
              <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Reason / Justification</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue placeholder="Select reason..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Strategic account — long-term contract">Strategic account — long-term contract</SelectItem>
                <SelectItem value="Early renewal incentive">Early renewal incentive</SelectItem>
                <SelectItem value="Volume commitment">Volume commitment</SelectItem>
                <SelectItem value="Competitive discount">Competitive discount</SelectItem>
                <SelectItem value="Promotional / pilot">Promotional / pilot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Internal Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Apply Discount</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
