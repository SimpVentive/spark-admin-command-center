import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Video, Image, Archive } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyScope } from "@/hooks/useCompanyScope";

const UploadContent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { scopeData } = useCompanyScope();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({ title: "", description: "", category_id: "", tags: "", language: "en", duration: "" });

  useEffect(() => {
    (supabase as any).from('content_categories').select('id, name').eq('is_active', true).then(({ data }: any) => setCategories(data || []));
  }, []);

  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === "dragenter" || e.type === "dragover"); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files[0]) setSelectedFile(e.dataTransfer.files[0]); };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); };

  const getContentType = (file: File) => {
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('image/')) return 'image';
    if (file.name.endsWith('.pptx') || file.name.endsWith('.ppt')) return 'presentation';
    if (file.name.endsWith('.zip') || file.name.endsWith('.scorm')) return 'scorm';
    return 'document';
  };

  const handleUpload = async () => {
    if (!selectedFile || !formData.title.trim()) {
      toast({ title: "Error", description: "File and title are required", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const filePath = `${Date.now()}-${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage.from('content-uploads').upload(filePath, selectedFile);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('content-uploads').getPublicUrl(filePath);

      const { error: dbError } = await (supabase as any).from('content_items').insert([scopeData({
        title: formData.title.trim(),
        description: formData.description || null,
        content_type: getContentType(selectedFile),
        file_format: selectedFile.name.split('.').pop()?.toUpperCase() || null,
        file_size: selectedFile.size,
        file_path: filePath,
        file_url: publicUrl,
        category_id: formData.category_id || null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        language: formData.language,
        duration_seconds: formData.duration ? parseInt(formData.duration) * 60 : null,
      })]);
      if (dbError) throw dbError;

      toast({ title: "Success", description: "Content uploaded successfully!" });
      navigate('/content/library');
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setUploading(false); }
  };

  const getFileIcon = (type: string) => {
    switch (type) { case "video": return <Video className="h-8 w-8" />; case "image": return <Image className="h-8 w-8" />; case "archive": return <Archive className="h-8 w-8" />; default: return <FileText className="h-8 w-8" />; }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold text-foreground">Upload Content</h1><p className="text-muted-foreground">Add new learning materials to your content library</p></div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>File Upload</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {selectedFile ? (
                <div><p className="font-medium">{selectedFile.name}</p><p className="text-sm text-muted-foreground">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p></div>
              ) : (
                <><h3 className="text-lg font-medium mb-2">Drop files here or click to browse</h3><p className="text-sm text-muted-foreground mb-4">Supports: MP4, PDF, PPTX, DOCX, SCORM packages</p></>
              )}
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} accept=".mp4,.mov,.avi,.pdf,.docx,.pptx,.ppt,.doc,.jpg,.png,.svg,.zip" />
              <Button type="button" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4 mr-2" />{selectedFile ? 'Change File' : 'Choose Files'}</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Content Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Title *</Label><Input value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="Enter content title" /></div>
            <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Brief description" /></div>
            <div>
              <Label>Category</Label>
              <Select value={formData.category_id} onValueChange={(v) => setFormData(p => ({ ...p, category_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Tags</Label><Input value={formData.tags} onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value }))} placeholder="Comma-separated tags" /></div>
            <div>
              <Label>Language</Label>
              <Select value={formData.language} onValueChange={(v) => setFormData(p => ({ ...p, language: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="es">Spanish</SelectItem><SelectItem value="fr">French</SelectItem><SelectItem value="de">German</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Duration (minutes)</Label><Input type="number" value={formData.duration} onChange={(e) => setFormData(p => ({ ...p, duration: e.target.value }))} placeholder="Estimated time" /></div>
            <Button className="w-full" onClick={handleUpload} disabled={uploading || !selectedFile}><Upload className="h-4 w-4 mr-2" />{uploading ? "Uploading..." : "Upload Content"}</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Supported File Types</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[{ type: "video", label: "Video Files", formats: "MP4, MOV, AVI" }, { type: "document", label: "Documents", formats: "PDF, DOCX, PPTX" }, { type: "image", label: "Images", formats: "JPG, PNG, SVG" }, { type: "archive", label: "Packages", formats: "SCORM, ZIP" }].map(f => (
              <div key={f.type} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                {getFileIcon(f.type)}<div><h4 className="font-medium">{f.label}</h4><p className="text-sm text-muted-foreground">{f.formats}</p></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadContent;
