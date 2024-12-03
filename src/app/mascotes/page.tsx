"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MascoteData = {
  nomeHomem: string;
  dadosMascotes: string;
};

export default function MascotesPage() {
  const [mascotes, setMascotes] = useState<MascoteData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/sheets?id=2")
      .then((res) => res.json())
      .then((result) => {
        if (Array.isArray(result.data) && result.data.length > 0) {
          setMascotes(processarDadosMascotes(result.data));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar os dados dos mascotes:", error);
        setIsLoading(false);
      });
  }, []);

  function processarDadosMascotes(data: string[][]): MascoteData[] {
    const headers = data[0];
    const nomeHomemIndex = headers.findIndex(
      (header: string) => header.toLowerCase() === "nome completo (homem)"
    );
    const dadosMascotesIndex = headers.findIndex(
      (header: string) => header.toLowerCase() === "dados dos mascotes"
    );

    return data.slice(1).reduce((acc: MascoteData[], row: string[]) => {
      const nomeHomem = row[nomeHomemIndex]?.trim();
      const dadosMascotes = row[dadosMascotesIndex]?.trim();
      if (nomeHomem && dadosMascotes) {
        acc.push({ nomeHomem, dadosMascotes });
      }
      return acc;
    }, []);
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Dados dos Mascotes
      </h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : mascotes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mascotes.map((mascote, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{mascote.nomeHomem}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{mascote.dadosMascotes}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>Nenhum dado de mascote encontrado.</p>
      )}
    </div>
  );
}
