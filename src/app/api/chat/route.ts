import { NextRequest, NextResponse } from "next/server";
import phonesData from "../../../data/phones.json";

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  const text = message.toLowerCase();

  // Adversarial/system prompt block
  if (
    /api ?key|reveal|system prompt|ignore instructions/i.test(text)
  ) {
    return NextResponse.json({
      response: "Sorry, I can't process that request. Let's find a great phone for you instead!"
    });
  }

  // Simple explainer/FAQ block
  if (/ois.*eis|optical.*electronic/i.test(text)) {
    return NextResponse.json({
      response: "OIS (Optical Image Stabilization) is hardware-based and helps keep photos sharp by physically moving the lens. EIS (Electronic Image Stabilization) uses software to reduce video shake. OIS is great for low-light photos. Want phones with OIS? Just ask!"
    });
  }

  // Brand filtering
  const allBrands = ["samsung","apple","redmi","realme","vivo","iqoo","nothing","google","oneplus"];
  const brand = allBrands.find(b => text.includes(b));

  // Budget extraction
  const budgetMatch = text.match(/under\s*₹?\s*([0-9]{3,6})|below\s*₹?\s*([0-9]{3,6})|less than\s*₹?\s*([0-9]{3,6})/);
  const budget = budgetMatch ? parseInt(budgetMatch[1] || budgetMatch[2] || budgetMatch[3], 10) : null;

  // Feature keywords
  const targetWords = [
    "gaming", "students", "camera", "battery", "ram", "storage", "waterproof", "5g", "budget", "photography",
    "amoled", "display", "charger", "performance", "compact", "lightweight"
  ];
  const wants = targetWords.filter(w => text.includes(w));

  // RAM and storage extraction
  const ramMatch = text.match(/(\d+)\s*gb ram/);
  const storageMatch = text.match(/(\d+)\s*gb storage/);

  // Filter phones based on criteria
  let result = phonesData.filter(phone => {
    let ok = true;
    if (brand) ok = ok && phone.brand.toLowerCase() === brand;
    if (budget) ok = ok && phone.price <= budget;
    if (wants.length) ok = ok && wants.every(word =>
      (phone.features && phone.features.join(" ").toLowerCase().includes(word)) ||
      (phone.specs && Object.values(phone.specs).join(" ").toLowerCase().includes(word))
    );
    if (ramMatch) ok = ok && phone.specs?.ram && phone.specs.ram.includes(ramMatch[1]);
    if (storageMatch) ok = ok && phone.specs?.storage && phone.specs.storage.includes(storageMatch[1]);
    return ok;
  });

  // Respond with details if user asks for more info
  if (text.includes("i like this phone") || text.includes("more details") || text.includes("tell me more")) {
    if (!result.length) {
      return NextResponse.json({ response: "Sorry, no matching phone found for details." });
    }
    const details = result.map(phone => {
      return `${phone.brand} ${phone.model} (₹${phone.price})\n` +
             `Display: ${phone.specs.display}\n` +
             `Processor: ${phone.specs.processor}\n` +
             `Camera: ${phone.specs.camera}\n` +
             `Battery: ${phone.specs.battery}\n` +
             `RAM: ${phone.specs.ram}\n` +
             `Storage: ${phone.specs.storage}\n` +
             `Features: ${phone.features.join(", ")}\n` +
             `Pros: ${phone.pros.join(", ")}\n` +
             `Cons: ${phone.cons.join(", ")}\n`;
    }).join("\n\n");
    return NextResponse.json({ response: details });
  }

  // If no matches found
  if (!result.length) {
    return NextResponse.json({
      response: "Sorry, no phones found matching your criteria. Try increasing your budget or changing requirements."
    });
  }

  // Multiple matches summary
  if (result.length > 1) {
    const names = result.slice(0, 5).map(p => `${p.brand} ${p.model} (₹${p.price})`).join(", ");
    return NextResponse.json({ response: `Here are some matches: ${names}` });
  }

  // Single top pick detailed response
  const top = result[0];
  return NextResponse.json({
    response: `Here's a top pick: ${top.brand} ${top.model} (₹${top.price}), features: ${top.features.join(", ")}.`
  });
}
