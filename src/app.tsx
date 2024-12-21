import { useState } from "preact/hooks";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import axios from "axios";
import { Label } from "./components/ui/label";
import { StatusBar, Style } from "@capacitor/status-bar";

export function App() {
  StatusBar.setBackgroundColor({ color: "#FFFFFF" });
  StatusBar.setStyle({ style: Style.Light });

  return (
    <div className="mx-auto p-8 prose prose-zinc dark:prose-invert max-w-[66ch] text-white">
      <div className=" max-w-[700px] h-fit inset-0 m-auto px-8 flex text-black bg-white dark:bg-black dark:text-white">
        <BBTB />
      </div>
    </div>
  );
}

function BBTB() {
  const [nama, setNama] = useState("");
  const [tinggi, setTinggi] = useState(0);
  const [berat, setBerat] = useState(0);
  const [umur, setUmur] = useState(0);
  const [bmi, setBmi] = useState(0);
  const [status, setStatus] = useState("");
  const [hasil, setHasil] = useState("");
  const [hasilAi, setHasilAi] = useState("");
  const [afterHitung, setAfterHitung] = useState(false);
  const [afterAi, setAfterAi] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  async function generateai() {
    const data = {
      contents: [
        {
          parts: [
            {
              text: `Nama saya ${nama}, umur saya ${umur}, tinggi badan saya ${tinggi}cm, dan berat badan saya ${berat}. hitung ideal tubuh saya dan berikan saya solusi perihal itu. berikan hasil dalam 1 paragraf bahasa indonesia non formal to the point saja.`,
            },
          ],
        },
      ],
    };
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyASj5AERhF6jGKyVd1G-qigLK_CwPa1Av4";
    setIsLoadingAi(true);
    try {
      const response = await axios.post(url, data);
      setHasilAi(response.data.candidates[0].content.parts[0].text);
      setAfterAi(true);
      setIsLoadingAi(false);
    } catch (error: any) {
      setHasilAi(error.response.data.error.message);
      setAfterAi(true);
      setIsLoadingAi(false);
    }
  }

  async function cekideal(e: any) {
    e.preventDefault();
    const tinggiMeter = tinggi / 100;
    const bmi = berat / (tinggiMeter * tinggiMeter);
    setBmi(bmi);

    if (bmi < 18.5) {
      setStatus("Kurang");
      setHasil("Kurang Berat Badan 🥲");
    } else if (bmi >= 18.5 && bmi <= 22.9) {
      setStatus("Normal");
      setHasil("Berat Badan Normal 😊");
    } else if (bmi >= 23 && bmi <= 29.9) {
      setStatus("Berlebih");
      setHasil("Berat Badan Berlebih 😅");
    } else if (bmi >= 30) {
      setStatus("Obesitas");
      setHasil("Obesitas 😭");
    }
    setAfterHitung(true);
  }

  function reset() {
    setNama("");
    setTinggi(0);
    setBerat(0);
    setBmi(0);
    setStatus("");
    setHasil("");
    setHasilAi("");
    setUmur(0);
    setAfterAi(false);
    setAfterHitung(false);
  }

  return (
    <div className="grid gap-3">
      <div className="text-xl font-bold text-center">
        INDEX MASSA TUBUH (BMI)
      </div>
      <div className="text-lg text-center">Hitung Berat Badan Ideal</div>
      <form className="grid grid-cols-1 gap-4" onSubmit={cekideal}>
        <div>
          <Label>Nama</Label>
          <Input
            type="text"
            placeholder="Masukkan nama kamu"
            value={nama}
            onChange={(e: any) => setNama(e.target.value)}
          />
        </div>
        <div>
          <Label>Tinggi Badan (cm)</Label>
          <Input
            type="number"
            placeholder="Tinggi Badan (cm)"
            value={tinggi === 0 ? "" : tinggi}
            onChange={(e: any) => setTinggi(e.target.value)}
          />
        </div>
        <div>
          <Label>Berat Badan (kg)</Label>
          <Input
            type="number"
            placeholder="Berat Badan (kg)"
            value={berat === 0 ? "" : berat}
            onChange={(e: any) => setBerat(e.target.value)}
          />
        </div>
        <div>
          <Label>Umur (tahun)</Label>
          <Input
            type="number"
            placeholder="masukkan umur"
            value={umur === 0 ? "" : umur}
            onChange={(e: any) => setUmur(e.target.value)}
          />
        </div>
        <Button>Hitung</Button>
      </form>
      {afterHitung && (
        <div className="grid gap-3 mt-5">
          <Button onClick={reset} variant="destructive">
            Reset
          </Button>
          <div className="text-lg text-center">
            {nama} BMI Anda: {bmi.toFixed(2)} ({status})
          </div>
          <div className="text-lg text-center">{hasil}</div>
          <Button
            variant="default"
            disabled={isLoadingAi}
            className="w-full"
            onClick={generateai}
          >
            Generate AI
          </Button>
          <div>{afterAi && <div>{hasilAi}</div>}</div>
        </div>
      )}
    </div>
  );
}
