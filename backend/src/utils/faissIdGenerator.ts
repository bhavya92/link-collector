import { v4 } from "uuid";

export const generate_faissId = () => {
    const uuid = v4();
    const intId = parseInt(uuid.replace(/-/g, '').slice(0, 15), 16) % (10 ** 8); // Convert to a unique 8-digit number
    return intId.toString();
}