
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

    const { skills, goal } = await req.json()

    if (!skills || !Array.isArray(skills) || !goal) {
      throw new Error('Invalid request: skills array and goal are required')
    }

    console.log("Generating recommendations for:", { skills, goal })

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
            content: `You are an AI educational advisor specializing in creating personalized learning paths. 
            Your task is to recommend the top 3 most relevant courses based on the user's skills and career goal.
            Format each course as a JSON object with these fields: id, title, provider, rating (1-5), skills (array), 
            level (Beginner/Intermediate/Advanced), url, and duration.`
          },
          {
            role: "user", 
            content: `Skills: ${skills.join(', ')}. Career Goal: ${goal}. Recommend 3 high-quality courses.`
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
    const courseRecommendations = JSON.parse(data.choices[0].message.content)
    
    console.log("Successfully generated recommendations")
    
    return new Response(
      JSON.stringify(courseRecommendations),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error("Error in generate-recommendations function:", error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
