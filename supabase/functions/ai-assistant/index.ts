
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found in environment variables')
    }

    const { skills, goal, prompt } = await req.json()

    if (!skills || !Array.isArray(skills) || !goal || !prompt) {
      throw new Error('Invalid request: skills array, goal, and prompt are required')
    }

    console.log("Generating AI assistant response for:", { skills, goal, prompt })

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI career coach specializing in educational pathways. 
            Provide insightful recommendations for skill development based on the user's 
            existing skills and career goals. Format as JSON with 'recommendations' array, 
            each containing 'title', 'reason', and 'nextSteps' (array of specific actions).`
          },
          {
            role: "user", 
            content: `Skills: ${skills.join(', ')}. Career Goal: ${goal}. Additional context: ${prompt}`
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("OpenAI API error:", errorData)
      throw new Error(`OpenAI API request failed: ${response.status}`)
    }

    const data = await response.json()
    const recommendations = JSON.parse(data.choices[0].message.content)
    
    console.log("Successfully generated AI assistant response")
    
    return new Response(
      JSON.stringify(recommendations),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error("Error in ai-assistant function:", error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
