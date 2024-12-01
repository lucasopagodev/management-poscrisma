"use client";

import { useEffect, useState } from "react";

type SheetData = string[][]; // Definindo o tipo para os dados da planilha

export default function Home() {
  const [data, setData] = useState<SheetData>([]); // Estado com tipagem para um array de arrays de strings
  const [isLoading, setIsLoading] = useState<boolean>(true); // Estado para controle de carregamento

  useEffect(() => {
    // Chamando a API para buscar os dados da planilha
    fetch("/api/sheets")
      .then((res) => res.json())
      .then((result) => {
        setData(result.data); // Atualizando os dados com a resposta da API
        setIsLoading(false); // Indicando que o carregamento terminou
      })
      .catch((error) => {
        console.error("Erro ao carregar os dados:", error);
        setIsLoading(false); // Indicando que o carregamento terminou, mesmo em caso de erro
      });
  }, []);

  return (
    <div>
      <h1>Dados da Planilha</h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : data.length ? (
        <table border={1}>
          <thead>
            <tr>
              {data[0].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum dado encontrado.</p>
      )}
    </div>
  );
}
