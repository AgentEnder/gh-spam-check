const allowlist = ["nx cloud", "angular", "vue", "nx"];
const denylist = [
    "psn", 
    "xbox", 
    "nintendo", 
    "steam", 
    "gift card",
    "giftcard",
    "gift-card",
    "playstation",
    "play station",
    "free!",
    "robux",
    "roblox",
];

export function checkTextContent(text: string) {
    const lowerCaseText = text.toLowerCase();
    // If any of the allowlisted words are found, we can return true immediately.
    // This prevents legitimate discussions from being flagged as spam.
    for (const word of allowlist) {
        if (lowerCaseText.includes(word)) {
            return true;
        }
    }
    
    // If any of the denylisted words are found, we can return false immediately.
    // This prevents spam from being allowed.
    for (const word of denylist) {
        if (lowerCaseText.includes(word)) {
            return false;
        }
    }

    // If no denylisted words are found, we can return true.
    // This means the text is not indicative spam.
    return true;
}
