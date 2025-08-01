import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  Globe
} from "lucide-react";

const ContentTools = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Tools</h1>
          <p className="text-muted-foreground">Convert and optimize your content for e-learning</p>
        </div>
      </div>

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
                <Button>
                  <PlayCircle className="h-4 w-4 mr-2" />
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
                <Button>
                  <FileVideo className="h-4 w-4 mr-2" />
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
                <Button>
                  <Package className="h-4 w-4 mr-2" />
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