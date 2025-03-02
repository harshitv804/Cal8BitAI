import Groq from "groq-sdk";

export async function hfModelApi({jsonObject}){

const client = new Groq({ apiKey: process.env.REACT_APP_GROQ_API_KEY,dangerouslyAllowBrowser: true });

const prompt = `<|begin_of_text|>
You are a calorie counter. You will process a input JSON-like object with the following structure:

{
  "name": "string",
  "quantity": "string",
  "calories": number,
  "protein": number
}

### Instructions:
1. Default Values: If only the "name" is provided:
   - Infer a default "quantity" based on standard serving sizes if the "quantity" is not mentioned by th user.
   - Multiple food names they will be separated by comma or a single sentence. Same follows for the "quantity" in same order.
   - Reason step-by-step like shown in output example to calculate the "calories" and "protein" for the inferred quantity if you feel it's wrong.
2. Invalid or Ambiguous Input: If the "name" or "quantity" is missing, unclear, or invalid:
   - Set "name": "NaN" and "quantity": "NaN".
   - Set "calories": 0 and "protein": 0.
3. Output Format:
   - Perform all calculations and reasoning within <think></think> tags.
   - Return only a structured JSON object inside <generate></generate> tags.
   - Only the final answers should be inside the output JSON and not calculations.
4. Clean Formatting: Rewrite the "name" and "quantity", title casing and concise terms.
5. No Additional Output: Do not include any explanations, text, or markdown outside of the <generate></generate> tags.

### Input:
{
name:${jsonObject.name},
quantity:${jsonObject.quantity},
calories:${jsonObject.calories},
protein:${jsonObject.protein}
}

### Output Example:
<think>
1. Chicken Biryani (1 plate):  
   - Average serving size of chicken biryani is ~1 plate (300g).  
   - Calories: 1 plate ≈ 600 kcal.  
   - Protein: 1 plate ≈ 30g.  

2. Eggs (2 eggs):  
   - Each egg has ~70 kcal and 6g protein.  
   - Calories: 2 eggs x 70 = 140 kcal.  
   - Protein: 2 eggs x 6 = 12g.  

3. Bread Rusks (2 rusks):  
   - Each bread rusk has ~50 kcal and 1g protein.  
   - Calories: 2 rusks x 50 = 100 kcal.  
   - Protein: 2 rusks x 1 = 2g.  

4. Totals:  
   - Calories: 600 (biryani) + 140 (eggs) + 100 (rusks) = **840 kcal.**  
   - Protein: 30 (biryani) + 12 (eggs) + 2 (rusks) = **44g.**  
</think>

<generate>
{
  "name": "Chicken Biryani, Eggs, Bread Rusks",
  "quantity": "1 plate, 2 eggs, 2 rusks",
  "calories": 840,
  "protein": 44
}
</generate>
<|eot_id|><|start_header_id|>user<|end_header_id|>

`
try {const completion = await client.chat.completions
    .create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    })
	const result =  completion.choices[0].message.content
	const contentInsideGenerate = result.match(/<generate>([\s\S]*?)<\/generate>/)?.[1].trim();
	const jsonObject = JSON.parse(contentInsideGenerate);
    return jsonObject}catch(error){
		if (error){
			alert("Failed❌ to connect with AI✨")
		}
        return false
    }
}