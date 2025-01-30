import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
export default async function getRTP(spins: number, currentData): Promise<void> {
    try {
        let spend: number = 0;
        let won: number = 0;
        currentData.playerData.rtpSpinCount = spins;

        for (let i = 0; i < currentData.playerData.rtpSpinCount; i++) {
            await currentData.spinResult();
            spend = currentData.playerData.totalbet;
            won = currentData.playerData.haveWon;
            console.log(`Spin ${i + 1} completed. ${currentData.playerData.totalbet} , ${won}`);
        }
        let rtp = 0;
        if (spend > 0) {
            rtp = won / spend;
        }
        console.log('RTP calculated:', currentData.currentGameData.gameId, spins, rtp * 100 + '%');
        const now = new Date();
        // Store the data in an Excel file
        const date = now.toISOString().split('T')[0];

        const filePath = path.resolve(__dirname, '../../../test', `simulator${date}.xlsx`);

        const newData = {
            username: currentData.currentGameData.username,
            gameId: currentData.currentGameData.gameId,
            spins,
            rtp: rtp * 100,
            date: new Date().toISOString()
        };

        let workbook;
        if (fs.existsSync(filePath)) {
            workbook = XLSX.readFile(filePath);
        } else {
            workbook = XLSX.utils.book_new();
        }

        let worksheet = workbook.Sheets['RTP Data'];
        if (!worksheet) {
            worksheet = XLSX.utils.json_to_sheet([]);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'RTP Data');
        }

        const existingData = XLSX.utils.sheet_to_json(worksheet);
        existingData.push(newData);
        const updatedWorksheet = XLSX.utils.json_to_sheet(existingData);
        workbook.Sheets['RTP Data'] = updatedWorksheet;

        XLSX.writeFile(workbook, filePath);

        // Restart the server using pm2
        exec('pm2 restart my-server', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error restarting server: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    } catch (error) {
        console.error("Failed to calculate RTP:", error);
        currentData.sendError("RTP calculation error");
    }
}
