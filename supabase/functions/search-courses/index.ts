
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

    const { query } = await req.json()

    if (!query || typeof query !== 'string') {
      throw new Error('Invalid request: search query is required')
    }

    console.log("Searching courses for:", query)

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
            content: `You are an API that returns educational course data based on search queries.
            Generate realistic course search results for the given query.
            For each course, include: id, title, partner (university/organization), description, 
            enrollmentCount (number), rating (1-5), and url. Return formatted as JSON array.`
          },
          {
            role: "user", 
            content: `Search query: ${query}`
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
    const searchResults = JSON.parse(data.choices[0].message.content)
    
    console.log("Successfully generated search results")
    
    return new Response(
      JSON.stringify(searchResults.slice(0, 5)), // Return top 5 results
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error("Error in search-courses function:", error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
