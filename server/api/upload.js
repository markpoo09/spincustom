// server/api/upload.js
import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
    // 1. Read Multipart Form Data
    const body = await readMultipartFormData(event)

    if (!body || body.length === 0) {
        throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
    }

    // 2. Get the first file
    const file = body[0]
    const filename = Date.now() + "_" + file.filename // Unique Name

    // 3. Save to "public/uploads" directory
    // Note: In Nuxt, "public" is exposed as root path
    const uploadDir = './public/uploads'
    const filePath = join(uploadDir, filename)

    // Ensure you create 'public/uploads' folder manually if not exists, 
    // or use fs.mkdir to create it. For this simple tutorial, we assume it exists
    // or we can add a check.

    // Write File
    await writeFile(filePath, file.data)

    // 4. Return URL
    return {
        url: `/uploads/${filename}`,
        success: true
    }
})