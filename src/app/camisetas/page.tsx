"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SheetData = string[][];

export default function Camisetas() {
  const [data, setData] = useState<SheetData>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tamanhos, setTamanhos] = useState<Record<string, number>>({});

  useEffect(() => {
    // Busca os dados da API
    fetch("/api/sheets?id=1")
      .then((res) => res.json())
      .then((result) => {
        if (Array.isArray(result.data) && result.data.length > 0) {
          setData(result.data);

          // Processa os tamanhos das camisetas
          const headers = result.data[0];
          const tamanhoIndex = headers.findIndex(
            (header: string) =>
              header.toLowerCase() === "qual o tamanho da sua camiseta?"
          );

          if (tamanhoIndex !== -1) {
            const count = result.data
              .slice(1)
              .reduce((acc: Record<string, number>, row: string[]) => {
                const tamanho = row[tamanhoIndex]?.trim();
                if (tamanho) {
                  acc[tamanho] = (acc[tamanho] || 0) + 1;
                }
                return acc;
              }, {} as Record<string, number>);

            setTamanhos(count);
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar os dados:", error);
        setIsLoading(false);
      });
  }, []);

  const totalCamisetas = Object.values(tamanhos).reduce(
    (total, quantidade) => total + quantidade,
    0
  );

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Estatísticas de Tamanhos de Camisetas
      </h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : Object.keys(tamanhos).length > 0 ? (
        <>
          <div className="mb-4 text-lg">
            <p>Quantidade total de pessoas: {data.length - 1}</p>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">
                    Tamanho da Camiseta
                  </TableHead>
                  <TableHead className="min-w-[150px]">Quantidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(tamanhos).map(([tamanho, quantidade]) => (
                  <TableRow key={tamanho}>
                    <TableCell>{tamanho}</TableCell>
                    <TableCell>{quantidade}</TableCell>
                  </TableRow>
                ))}
                {/* Linha de Total */}
                <TableRow className="font-bold bg-gray-100">
                  <TableCell>Total</TableCell>
                  <TableCell>{totalCamisetas}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <p>Nenhum dado de tamanhos de camisetas encontrado.</p>
      )}
    </div>
  );
}
