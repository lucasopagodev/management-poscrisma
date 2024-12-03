/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SheetData = string[][];
type TamanhosCount = Record<string, number>;

export default function Camisetas() {
  const [data1, setData1] = useState<SheetData>([]);
  const [data2, setData2] = useState<SheetData>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tamanhos1, setTamanhos1] = useState<TamanhosCount>({});
  const [tamanhos2, setTamanhos2] = useState<TamanhosCount>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/sheets?id=1").then((res) => res.json()),
      fetch("/api/sheets?id=2").then((res) => res.json()),
    ])
      .then(([result1, result2]) => {
        if (Array.isArray(result1.data) && result1.data.length > 0) {
          setData1(result1.data);
          setTamanhos1(processarDados(result1.data, false));
        }
        if (Array.isArray(result2.data) && result2.data.length > 0) {
          setData2(result2.data);
          setTamanhos2(processarDados(result2.data, true));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar os dados:", error);
        setIsLoading(false);
      });
  }, []);

  function processarDados(
    data: SheetData,
    isCasalSheet: boolean
  ): TamanhosCount {
    const headers = data[0];
    const tamanhoIndex = headers.findIndex(
      (header: string) =>
        header.toLowerCase() === "qual o tamanho da sua camiseta?"
    );
    const casalIndex = isCasalSheet
      ? headers.findIndex(
          (header: string) => header.toLowerCase() === "é casal?"
        )
      : -1;
    const tamanhoHomemIndex = isCasalSheet
      ? headers.findIndex(
          (header: string) =>
            header.toLowerCase() === "qual o tamanho da sua camiseta? (homem)"
        )
      : -1;
    const tamanhoMulherIndex = isCasalSheet
      ? headers.findIndex(
          (header: string) =>
            header.toLowerCase() === "qual o tamanho da sua camiseta? (mulher)"
        )
      : -1;

    return data.slice(1).reduce((acc: TamanhosCount, row: string[]) => {
      if (isCasalSheet) {
        const eCasal = row[casalIndex]?.trim().toLowerCase() === "sim";
        if (eCasal) {
          const tamanhoHomem = row[tamanhoHomemIndex]?.trim();
          const tamanhoMulher = row[tamanhoMulherIndex]?.trim();
          if (tamanhoHomem) acc[tamanhoHomem] = (acc[tamanhoHomem] || 0) + 1;
          if (tamanhoMulher) acc[tamanhoMulher] = (acc[tamanhoMulher] || 0) + 1;
        } else {
          const tamanho = row[tamanhoIndex]?.trim();
          if (tamanho) acc[tamanho] = (acc[tamanho] || 0) + 1;
        }
      } else {
        const tamanho = row[tamanhoIndex]?.trim();
        if (tamanho) acc[tamanho] = (acc[tamanho] || 0) + 1;
      }
      return acc;
    }, {});
  }

  function renderTable(tamanhos: TamanhosCount, title: string) {
    const totalCamisetas = Object.values(tamanhos).reduce(
      (total, quantidade) => total + quantidade,
      0
    );

    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-lg">
            <p>Quantidade total de camisetas: {totalCamisetas}</p>
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
                <TableRow className="font-bold bg-gray-100">
                  <TableCell>Total</TableCell>
                  <TableCell>{totalCamisetas}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Estatísticas de Tamanhos de Camisetas
      </h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {renderTable(tamanhos1, "Afilhado - Camisetas")}
          {renderTable(
            tamanhos2,
            "Padrinhos/Catequistas - Camisetas (com casais)"
          )}
        </>
      )}
    </div>
  );
}
