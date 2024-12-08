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
  const [tamanhosAfilhados, setTamanhosAfilhados] = useState<TamanhosCount>({});
  const [tamanhosCrismandos, setTamanhosCrismandos] = useState<TamanhosCount>(
    {}
  );
  const [tamanhosPadrinhos, setTamanhosPadrinhos] = useState<TamanhosCount>({});
  const [tamanhosMadrinhas, setTamanhosMadrinhas] = useState<TamanhosCount>({});
  const [tamanhosVoluntarios, setTamanhosVoluntarios] = useState<TamanhosCount>(
    {}
  );

  useEffect(() => {
    Promise.all([
      fetch("/api/sheets?id=1").then((res) => res.json()),
      fetch("/api/sheets?id=2").then((res) => res.json()),
    ])
      .then(([result1, result2]) => {
        if (Array.isArray(result1.data) && result1.data.length > 0) {
          setData1(result1.data);
          const { afilhados, crismandos } = processarDadosPlanilha1(
            result1.data
          );
          setTamanhosAfilhados(afilhados);
          setTamanhosCrismandos(crismandos);
        }
        if (Array.isArray(result2.data) && result2.data.length > 0) {
          setData2(result2.data);
          const { padrinhos, madrinhas, voluntarios } = processarDadosPlanilha2(
            result2.data
          );
          setTamanhosPadrinhos(padrinhos);
          setTamanhosMadrinhas(madrinhas);
          setTamanhosVoluntarios(voluntarios);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar os dados:", error);
        setIsLoading(false);
      });
  }, []);

  function processarDadosPlanilha1(data: SheetData) {
    const headers = data[0];
    const tamanhoIndex = headers.findIndex(
      (header: string) =>
        header.toLowerCase() === "qual o tamanho da sua camiseta?"
    );
    const casalPadrinhoCatequistaIndex = headers.findIndex(
      (header: string) =>
        header.toLowerCase() === "casal padrinho ou catequista"
    );

    const afilhados: TamanhosCount = {};
    const crismandos: TamanhosCount = {};

    data.slice(1).forEach((row: string[]) => {
      const tamanho = row[tamanhoIndex]?.trim();
      const casalPadrinhoCatequista = row[casalPadrinhoCatequistaIndex]?.trim();

      if (tamanho) {
        if (
          casalPadrinhoCatequista &&
          casalPadrinhoCatequista.toLowerCase().includes("catequista")
        ) {
          crismandos[tamanho] = (crismandos[tamanho] || 0) + 1;
        } else {
          afilhados[tamanho] = (afilhados[tamanho] || 0) + 1;
        }
      }
    });

    return { afilhados, crismandos };
  }

  function processarDadosPlanilha2(data: SheetData) {
    const headers = data[0];
    const tamanhoHomemIndex = headers.findIndex(
      (header: string) =>
        header.toLowerCase() === "qual o tamanho da sua camiseta? (homem)"
    );
    const tamanhoMulherIndex = headers.findIndex(
      (header: string) =>
        header.toLowerCase() === "qual o tamanho da sua camiseta? (mulher)"
    );
    const tamanhoVoluntarioIndex = headers.findIndex(
      (header: string) =>
        header.toLowerCase() === "qual o tamanho da sua camiseta?"
    );

    const padrinhos: TamanhosCount = {};
    const madrinhas: TamanhosCount = {};
    const voluntarios: TamanhosCount = {};

    data.slice(1).forEach((row: string[]) => {
      const tamanhoHomem = row[tamanhoHomemIndex]?.trim();
      const tamanhoMulher = row[tamanhoMulherIndex]?.trim();
      const tamanhoVoluntario = row[tamanhoVoluntarioIndex]?.trim();

      if (tamanhoHomem) {
        padrinhos[tamanhoHomem] = (padrinhos[tamanhoHomem] || 0) + 1;
      }
      if (tamanhoMulher) {
        madrinhas[tamanhoMulher] = (madrinhas[tamanhoMulher] || 0) + 1;
      }
      if (tamanhoVoluntario) {
        voluntarios[tamanhoVoluntario] =
          (voluntarios[tamanhoVoluntario] || 0) + 1;
      }
    });

    return { padrinhos, madrinhas, voluntarios };
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
          {renderTable(tamanhosAfilhados, "Afilhados - Camisetas")}
          {renderTable(tamanhosCrismandos, "Crismandos - Camisetas")}
          {renderTable(tamanhosPadrinhos, "Padrinhos - Camisetas")}
          {renderTable(tamanhosMadrinhas, "Madrinhas - Camisetas")}
          {renderTable(tamanhosVoluntarios, "Voluntários - Camisetas")}
        </>
      )}
    </div>
  );
}
