import { useState } from "react";
import { textToImg } from 'dreamstudio.js';
import cadenaLogo from './assets/cadenaLogo.png';

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = import.meta.env.VITE_DREAMSTUDIO_API_KEY;

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await textToImg({
        apiKey,
        engineId: 'stable-diffusion-xl-beta-v2-2-2',
        samples: 4,
        text_prompts: [
          {
            text: `${prompt}`,
            weight: 1,
          },
        ],
      });
      console.log(response.artifacts);
      setImages(response.artifacts);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:p-0">
      <img src={cadenaLogo} alt="Cadena Logo" className="h-12 mb-10 mt-40" />
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="flex items-center border-b-2 border-indigo-600 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Describe a scene you want to generate."
            value={prompt}
            onChange={handlePromptChange}
          />
          <button
            className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Generate
          </button>
        </div>
      </form>
      {isLoading ? (
        <div className="w-full max-w-lg mt-4 text-center text-white">
          <p>Please wait, images are being rendered...⏳</p>
        </div>
      ) : (
        <div className="w-full max-w-lg mt-4">
          {images.map((image, index) => (
            <div key={index} className="bg-white shadow-md rounded p-4 mb-4">
              <img src={`data:image/jpeg;base64,${image.base64}`} alt="Base64 Image" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
