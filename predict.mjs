// Import gradio client
import { client } from "@gradio/client";

// Get secrets
import secrets from './config.json' assert { type: "json" };
const { hf_token, space } = secrets;

// Image classification parametres and function
let ST = 0.0;
let IoU = 0.0;
export async function Predict(url, ST=0.0, IoU=0.0) {
	const response_0 = await fetch(url);
	const image = await response_0.blob();

	const app = await client(space, {serialize:false, hf_token:hf_token});
	const result = await app.predict("/predict", [
				image, 	// blob in 'Input' Image component		
				ST, // number (numeric value between 0 and 1) in 'Score Threshold' Slider component		
				IoU, // number (numeric value between 0 and 1) in 'IoU Threshold' Slider component
	]);
	var predictions = result.data;

	if (predictions=="True") {
		return true;
	} else {
		return false;
	}
}