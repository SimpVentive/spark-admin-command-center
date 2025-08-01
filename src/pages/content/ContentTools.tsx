import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Video, 
  FileVideo, 
  Package, 
  Monitor, 
  Settings, 
  Download, 
  PlayCircle,
  FileText,
  Zap,
  Globe,
  Upload,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ContentTools = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [results, setResults] = useState<any>(null);
  const [showProgressDialog, setShowProgressDialog] = useState(false);

  // PPT to Video conversion
  const handlePptToVideoConversion = async () => {
    try {
      setIsLoading(true);
      setProgress(0);
      setCurrentTask("Initializing PPT to Video conversion...");
      setShowProgressDialog(true);
      setResults(null);

      const { data, error } = await supabase.functions.invoke('ppt-to-video', {
        body: { 
          file: { name: 'sample-presentation.pptx' },
          settings: { resolution: '1080p', fps: 30 }
        }
      });

      if (error) throw error;

      // Simulate progress updates
      for (let i = 0; i <= 100; i += 20) {
        setProgress(i);
        setCurrentTask(data.steps[Math.floor(i / 20)] || "Processing...");
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setResults(data);
      toast.success("PPT to Video conversion completed successfully!");
    } catch (error) {
      console.error('PPT conversion error:', error);
      toast.error("Failed to convert presentation to video");
    } finally {
      setIsLoading(false);
    }
  };

  // Video format conversion
  const handleVideoFormatConversion = async () => {
    try {
      setIsLoading(true);
      setProgress(0);
      setCurrentTask("Starting video format conversion...");
      setShowProgressDialog(true);
      setResults(null);

      const { data, error } = await supabase.functions.invoke('video-format-converter', {
        body: { 
          file: { name: 'sample-video.avi', size: '150 MB' },
          outputFormat: 'MP4',
          settings: { resolution: '1920x1080', bitrate: '5 Mbps' }
        }
      });

      if (error) throw error;

      // Simulate progress updates
      for (let i = 0; i <= 100; i += 15) {
        setProgress(i);
        setCurrentTask(data.steps[Math.floor(i / 15)] || "Converting...");
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      setResults(data);
      toast.success("Video format conversion completed successfully!");
    } catch (error) {
      console.error('Video conversion error:', error);
      toast.error("Failed to convert video format");
    } finally {
      setIsLoading(false);
    }
  };

  // SCORM package creation
  const handleScormPackageCreation = async () => {
    try {
      setIsLoading(true);
      setProgress(0);
      setCurrentTask("Creating SCORM package...");
      setShowProgressDialog(true);
      setResults(null);

      const { data, error } = await supabase.functions.invoke('scorm-package-creator', {
        body: { 
          content: { type: 'video', url: '/sample-content.mp4' },
          metadata: { 
            title: 'Learning Module', 
            description: 'Interactive learning content' 
          },
          scormVersion: 'SCORM 2004 4th Edition'
        }
      });

      if (error) throw error;

      // Simulate progress updates
      for (let i = 0; i <= 100; i += 12.5) {
        setProgress(i);
        setCurrentTask(data.steps[Math.floor(i / 12.5)] || "Building package...");
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      setResults(data);
      toast.success("SCORM package created successfully!");
    } catch (error) {
      console.error('SCORM creation error:', error);
      toast.error("Failed to create SCORM package");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Tools</h1>
          <p className="text-muted-foreground">Convert and optimize your content for e-learning</p>
        </div>
      </div>

      {/* Progress Dialog */}
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Processing Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{currentTask}</span>
            </div>
            {results && (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium text-green-600">Conversion Complete!</h4>
                {results.metadata && (
                  <div className="space-y-1 text-sm">
                    <p><strong>Output:</strong> {results.metadata.outputFormat || results.packageInfo?.name}</p>
                    <p><strong>Size:</strong> {results.metadata.outputSize || results.packageInfo?.size}</p>
                    {results.metadata.duration && <p><strong>Duration:</strong> {results.metadata.duration}</p>}
                  </div>
                )}
                <Button 
                  onClick={() => {
                    setShowProgressDialog(false);
                    if (results.downloadUrl) {
                      toast.success("Download started!");
                    }
                  }}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Result
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="ppt-video" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ppt-video">PPT to Video</TabsTrigger>
          <TabsTrigger value="video-format">Video Format</TabsTrigger>
          <TabsTrigger value="scorm">SCORM Package</TabsTrigger>
        </TabsList>

        {/* PPT to Video Conversion */}
        <TabsContent value="ppt-video" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Video className="h-6 w-6" />
                <CardTitle>PowerPoint to Video Conversion</CardTitle>
              </div>
              <p className="text-muted-foreground">Transform your presentations into engaging video content</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Technical Instructions
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Microsoft PowerPoint Built-in Export</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Open your PowerPoint presentation</li>
                        <li>Go to File → Export → Create a Video</li>
                        <li>Choose quality: Ultra HD (4K), Full HD (1080p), or HD (720p)</li>
                        <li>Set timing: Use Recorded Timings or set seconds per slide</li>
                        <li>Click "Create Video" and choose save location</li>
                      </ol>
                    </div>
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Alternative Free Tools</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>LibreOffice Impress:</strong> File → Export as → Video (MP4)</li>
                        <li><strong>Canva:</strong> Upload PPT, convert to video presentation</li>
                        <li><strong>OBS Studio:</strong> Screen record while presenting</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Voice Narration Recording</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Use PowerPoint's "Record Slide Show" feature</li>
                        <li>Record audio using Audacity (free) for better quality</li>
                        <li>Ensure quiet environment and good microphone</li>
                        <li>Speak clearly with appropriate pace</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Output Specifications
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Optimal Settings</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>Format:</strong> MP4 (H.264 codec)</li>
                        <li><strong>Resolution:</strong> 1920x1080 (1080p)</li>
                        <li><strong>Frame Rate:</strong> 30 fps</li>
                        <li><strong>Bitrate:</strong> 5-8 Mbps for quality</li>
                        <li><strong>Audio:</strong> AAC, 128 kbps, 44.1 kHz</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Transition Timing</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li><strong>Simple slides:</strong> 5-8 seconds</li>
                        <li><strong>Complex slides:</strong> 10-15 seconds</li>
                        <li><strong>Title slides:</strong> 3-5 seconds</li>
                        <li><strong>Transition effects:</strong> 0.5-1 second duration</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Additional Features</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Add background music (royalty-free)</li>
                        <li>Include captions for accessibility</li>
                        <li>Compress for web delivery (under 100MB)</li>
                        <li>Test on mobile devices</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handlePptToVideoConversion} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <PlayCircle className="h-4 w-4 mr-2" />}
                  Start Conversion
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Video Format Conversion */}
        <TabsContent value="video-format" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileVideo className="h-6 w-6" />
                <CardTitle>Video Format Conversion</CardTitle>
              </div>
              <p className="text-muted-foreground">Convert video files to MP4 format using free tools</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Primary Tools</h3>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      HandBrake (Recommended)
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Download and install HandBrake (free)</li>
                      <li>Open source video file</li>
                      <li>Select "Fast 1080p30" preset</li>
                      <li>Choose MP4 container format</li>
                      <li>Set video codec to H.264</li>
                      <li>Audio: AAC (CoreAudio) 128 kbps</li>
                      <li>Click "Start Encode"</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">FFmpeg Commands</h4>
                    <div className="bg-black text-green-400 p-2 rounded text-xs font-mono">
                      <p># Basic conversion</p>
                      <p>ffmpeg -i input.avi output.mp4</p>
                      <br />
                      <p># With optimization</p>
                      <p>ffmpeg -i input.avi -c:v libx264 -crf 23 -c:a aac -b:a 128k output.mp4</p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">VLC Media Player</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      <li>Media → Convert/Save</li>
                      <li>Add source file</li>
                      <li>Click "Convert/Save"</li>
                      <li>Profile: Video - H.264 + MP3 (MP4)</li>
                      <li>Choose destination and start</li>
                    </ol>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Optimization Settings</h3>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">File Size Reduction</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>CRF Value:</strong> 18-23 (lower = better quality)</li>
                      <li><strong>Resolution:</strong> Scale down if over 1080p</li>
                      <li><strong>Frame Rate:</strong> 24-30 fps maximum</li>
                      <li><strong>Two-pass encoding</strong> for better compression</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">LMS Requirements</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Max file size:</strong> Usually 100-500MB</li>
                      <li><strong>Supported formats:</strong> MP4, WebM</li>
                      <li><strong>Codec:</strong> H.264 for compatibility</li>
                      <li><strong>Mobile support:</strong> Test on iOS/Android</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Troubleshooting</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Audio sync issues:</strong> Use -async 1 in FFmpeg</li>
                      <li><strong>Large file size:</strong> Increase CRF value</li>
                      <li><strong>Poor quality:</strong> Lower CRF or increase bitrate</li>
                      <li><strong>Compatibility:</strong> Use baseline profile</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleVideoFormatConversion} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileVideo className="h-4 w-4 mr-2" />}
                  Convert Video
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Tools
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SCORM Package Creation */}
        <TabsContent value="scorm" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6" />
                <CardTitle>SCORM Package Creation</CardTitle>
              </div>
              <p className="text-muted-foreground">Build SCORM-compliant learning packages for LMS deployment</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Package Structure</h3>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Required Files</h4>
                    <div className="bg-black text-green-400 p-2 rounded text-xs font-mono">
                      <p>scorm-package/</p>
                      <p>├── imsmanifest.xml</p>
                      <p>├── adlcp_rootv1p2.xsd</p>
                      <p>├── content/</p>
                      <p>│   ├── index.html</p>
                      <p>│   ├── css/</p>
                      <p>│   ├── js/</p>
                      <p>│   └── media/</p>
                      <p>└── scripts/</p>
                      <p>    └── scorm_api.js</p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Manifest Configuration</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Define course metadata</li>
                      <li>Set learning objectives</li>
                      <li>Configure sequencing rules</li>
                      <li>Specify completion criteria</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Free Authoring Tools</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>eXeLearning:</strong> Web-based authoring</li>
                      <li><strong>H5P:</strong> Interactive content creation</li>
                      <li><strong>Adapt Learning:</strong> Responsive framework</li>
                      <li><strong>SCORM Cloud:</strong> Testing and validation</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Content Integration</h3>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Video Integration</h4>
                    <div className="bg-black text-green-400 p-2 rounded text-xs font-mono">
                      <p>&lt;video controls&gt;</p>
                      <p>  &lt;source src="media/lesson1.mp4" type="video/mp4"&gt;</p>
                      <p>&lt;/video&gt;</p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Progress Tracking</h4>
                    <div className="bg-black text-green-400 p-2 rounded text-xs font-mono">
                      <p>// Set completion status</p>
                      <p>scorm.set("cmi.completion_status", "completed");</p>
                      <p>scorm.set("cmi.score.raw", "85");</p>
                      <p>scorm.commit();</p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">SCORM Versions</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>SCORM 1.2:</strong> Wide compatibility, basic tracking</li>
                      <li><strong>SCORM 2004:</strong> Advanced sequencing, better navigation</li>
                      <li><strong>xAPI (Tin Can):</strong> Modern alternative, detailed analytics</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Testing Checklist</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>✓ Package validates in SCORM testing tool</li>
                      <li>✓ Launches correctly in LMS</li>
                      <li>✓ Progress tracking works</li>
                      <li>✓ Completion status updates</li>
                      <li>✓ Responsive on mobile devices</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleScormPackageCreation} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Package className="h-4 w-4 mr-2" />}
                  Create SCORM Package
                </Button>
                <Button variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  Test in SCORM Cloud
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentTools;