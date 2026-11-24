
import { createHash } from "node:crypto";

function generateETag(data) {

    // Convert response data into JSON string
    const jsonData = JSON.stringify(data);

    // Generate SHA-256 hash
    const hash = createHash("sha256")
        .update(jsonData)
        .digest("hex");

    // Return hash as an ETag
    return `"${hash}"`;
}

export default generateETag;
