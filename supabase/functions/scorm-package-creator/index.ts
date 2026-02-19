import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, metadata, scormVersion } = await req.json();
    
    console.log('SCORM package creation started', { scormVersion, metadata });

    // Simulate SCORM package creation process
    const creationSteps = [
      'Creating manifest.xml file...',
      'Setting up folder structure...',
      'Generating HTML content files...',
      'Adding SCORM API wrapper...',
      'Configuring tracking parameters...',
      'Creating CSS stylesheets...',
      'Adding JavaScript functionality...',
      'Packaging into ZIP archive...'
    ];

    // Generate SCORM manifest template
    const manifestContent = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="SCORM_PACKAGE_${Date.now()}" version="1.0" 
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>${scormVersion || '2004 4th Edition'}</schemaversion>
    <lom:lom xmlns:lom="http://ltsc.ieee.org/xsd/LOM">
      <lom:general>
        <lom:title>
          <lom:string language="en">${metadata?.title || 'Learning Module'}</lom:string>
        </lom:title>
        <lom:description>
          <lom:string language="en">${metadata?.description || 'Interactive learning content'}</lom:string>
        </lom:description>
      </lom:general>
    </lom:lom>
  </metadata>
  <organizations default="ORG-1">
    <organization identifier="ORG-1">
      <title>${metadata?.title || 'Learning Module'}</title>
      <item identifier="ITEM-1" identifierref="RES-1">
        <title>Main Content</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES-1" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html"/>
      <file href="scripts/scorm_api.js"/>
      <file href="css/styles.css"/>
    </resource>
  </resources>
</manifest>`;

    const result = {
      success: true,
      steps: creationSteps,
      packageInfo: {
        name: `${metadata?.title?.replace(/\s+/g, '_') || 'learning_module'}_scorm.zip`,
        scormVersion: scormVersion || 'SCORM 2004 4th Edition',
        size: '12.5 MB',
        files: [
          'imsmanifest.xml',
          'index.html',
          'scripts/scorm_api.js',
          'css/styles.css',
          'media/',
          'content/'
        ],
        features: [
          'Progress tracking',
          'Completion status',
          'Score reporting',
          'Bookmark functionality',
          'Mobile responsive',
          'LMS compatible'
        ]
      },
      manifest: manifestContent,
      downloadUrl: '/downloads/scorm-package.zip',
      testUrl: '/scorm-test/validate-package'
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in SCORM package creation:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: (error as Error).message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});