import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import { IamAuthenticator } from 'ibm-watson/auth/index.js';
import SpeechToTextV1 from 'ibm-watson/speech-to-text/v1.js';
import { LangflowClient } from '@datastax/langflow-client';
import path from "path";

const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());
// app.use(cors({
//     origin: 'https://ai-captioning-and-transcription.onrender.com', 
//     credentials: true,
// }));
const __dirname = path.resolve();

async function fetchLangflowResponse(inputValue, inputType = "chat", outputType = "chat") {
    // console.log(inputValue);
    try {
        const langflowId = process.env.LANGFLOWID ;  
        const flowId = process.env.FLOWID ;  
        const apiKey = process.env.LANGCHAIN_TOKEN ; 
        
        const client = new LangflowClient({ langflowId, apiKey });  
        const flow = client.flow(flowId);

        const result = await flow.run(inputValue);
        const ans = result.outputs[0].outputs[0].artifacts.message;
        // console.log("Langflow Response:", result.outputs[0].outputs[0].artifacts.message);
        return ans;

    } catch (error) {
        console.error("Langflow API Error:", error);
        throw error;
    }
}


app.post('/api', async (req, res) => {
    const { inputValue, inputType, outputType } = req.body;
    try {
        let output = await fetchLangflowResponse(inputValue, inputType, outputType);
        res.status(200).send({ success: true, output });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/fetch-caption', async (req, res) => {
    const { videoUrl } = req.body;
    if (!videoUrl) return res.status(400).json({ error: 'YouTube video URL is required' });
    
    try {
        const videoId = new URL(videoUrl).searchParams.get('v');
        if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });
        
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        res.json({ transcript });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transcript', message: error.message });
    }
});

const apiKey = process.env.IBM_API_KEY;
const serviceUrl = process.env.IBM_URL;
const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({ apikey: apiKey }),
    serviceUrl: serviceUrl,
});

app.post('/convert-audio-to-text', async (req, res) => {
    const { audioUrl } = req.body;
    
    try {
        const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
        const audioBuffer = audioResponse.data;
        
        const recognizeParams = {
            audio: audioBuffer,
            contentType: 'audio/mp3',
            model: 'en-US_BroadbandModel',
        };
        
        const { result } = await speechToText.recognize(recognizeParams);
        const transcription = result.results.map(res => res.alternatives[0].transcript).join('\n');
        
        res.status(200).json({ transcription });
    } catch (error) {
        res.status(500).json({ error: 'Error converting audio to text', details: error.message });
    }
});

if (process.env.NODE_ENV === "production"){
    console.log(process.env.NODE_ENV);
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
