import fs from 'fs'
import archiver from 'archiver'

let handler = async (m, { conn }) => {
    const sessionDir = './session' // ganti jika folder session berbeda

    if (!fs.existsSync(sessionDir)) {
        return m.reply('Folder session tidak ditemukan.')
    }

    const zip = './session.zip'
    const output = fs.createWriteStream(zip)
    const archive = archiver('zip', {
        zlib: { level: 9 }
    })

    archive.pipe(output)
    archive.directory(sessionDir, false)
    await archive.finalize()

    output.on('close', async () => {
        await conn.sendMessage(m.chat, {
            document: fs.readFileSync(zip),
            mimetype: 'application/zip',
            fileName: 'session.zip'
        }, { quoted: m })

        fs.unlinkSync(zip)
    })
}

handler.help = ['getsession']
handler.tags = ['owner']
handler.command = /^getsession$/i
handler.rowner = true

export default handler
