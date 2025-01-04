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
import { Input } from "@/components/ui/input";

type SheetData = string[][];
type PessoaInfo = {
  nome: string;
  cpf: string;
  tamanhoCamiseta: string;
  tipo: string;
};

function removerAcentos(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function BuscaPessoas() {
  const [data1, setData1] = useState<SheetData>([]);
  const [data2, setData2] = useState<SheetData>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [todasPessoas, setTodasPessoas] = useState<PessoaInfo[]>([]);
  const [pessoasFiltradas, setPessoasFiltradas] = useState<PessoaInfo[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/sheets?id=1").then((res) => res.json()),
      fetch("/api/sheets?id=2").then((res) => res.json()),
    ])
      .then(([result1, result2]) => {
        if (Array.isArray(result1.data) && result1.data.length > 0) {
          setData1(result1.data);
        }
        if (Array.isArray(result2.data) && result2.data.length > 0) {
          setData2(result2.data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar os dados:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (data1.length > 0 || data2.length > 0) {
      const pessoasData1 = data1.length > 0 ? processarDados(data1, 1) : [];
      const pessoasData2 = data2.length > 0 ? processarDados(data2, 2) : [];
      const todas = [...pessoasData1, ...pessoasData2];
      console.log("Total de pessoas processadas:", todas.length);
      setTodasPessoas(todas);
      setPessoasFiltradas(todas);
    }
  }, [data1, data2]);

  useEffect(() => {
    const termoBuscaSemAcento = removerAcentos(searchTerm.toLowerCase());
    const resultados = todasPessoas.filter((pessoa) =>
      removerAcentos(pessoa.nome.toLowerCase()).includes(termoBuscaSemAcento)
    );
    setPessoasFiltradas(resultados);
  }, [searchTerm, todasPessoas]);

  function processarDados(data: SheetData, sheetId: number): PessoaInfo[] {
    console.log(`Processando dados da planilha ${sheetId}`);
    console.log("Headers:", data[0]);
    if (!data || data.length === 0) {
      return [];
    }

    const headers = data[0];
    let pessoas: PessoaInfo[] = [];

    if (sheetId === 1) {
      const nomeIndex = headers.findIndex((header: string) =>
        header.toLowerCase().includes("nome")
      );
      const cpfIndex = headers.findIndex((header: string) =>
        header.toLowerCase().includes("cpf")
      );
      const tamanhoIndex = headers.findIndex((header: string) =>
        header.toLowerCase().includes("tamanho da sua camiseta")
      );

      pessoas = data.slice(1).map((row: string[]) => ({
        nome: row[nomeIndex]?.trim() || "",
        cpf: row[cpfIndex]?.trim() || "",
        tamanhoCamiseta: row[tamanhoIndex]?.trim() || "",
        tipo: "Afilhado/Crismando",
      }));
    } else if (sheetId === 2) {
      console.log("Processando planilha 2");
      const eCasalIndex = headers.findIndex((header: string) =>
        header.toLowerCase().includes("é casal?")
      );
      const nomeIndex = headers.findIndex(
        (header: string) => header.toLowerCase() === "nome completo"
      );
      const cpfIndex = headers.findIndex(
        (header: string) => header.toLowerCase() === "cpf ou rg"
      );
      const tamanhoIndex = headers.findIndex(
        (header: string) =>
          header.toLowerCase() === "qual o tamanho da sua camiseta?"
      );
      const nomeHomemIndex = headers.findIndex((header: string) =>
        header.toLowerCase().includes("nome completo (homem)")
      );
      const nomeMulherIndex = headers.findIndex((header: string) =>
        header.toLowerCase().includes("nome completo (mulher)")
      );
      const cpfHomemIndex = headers.findIndex((header: string) =>
        header.toLowerCase().includes("cpf ou rg (homem)")
      );
      const cpfMulherIndex = headers.findIndex((header: string) =>
        header.toLowerCase().includes("cpf ou rg (mulher)")
      );
      const tamanhoHomemIndex = headers.findIndex((header: string) =>
        header.toLowerCase().includes("qual o tamanho da sua camiseta? (homem)")
      );
      const tamanhoMulherIndex = headers.findIndex((header: string) =>
        header
          .toLowerCase()
          .includes("qual o tamanho da sua camiseta? (mulher)")
      );

      console.log("Índices encontrados:", {
        eCasalIndex,
        nomeIndex,
        cpfIndex,
        tamanhoIndex,
        nomeHomemIndex,
        nomeMulherIndex,
        cpfHomemIndex,
        cpfMulherIndex,
        tamanhoHomemIndex,
        tamanhoMulherIndex,
      });

      data.slice(1).forEach((row: string[], rowIndex: number) => {
        console.log(`Processando linha ${rowIndex + 1}:`, row);
        const eCasal = row[eCasalIndex]?.trim().toLowerCase() === "sim";

        if (eCasal) {
          const nomeHomem = row[nomeHomemIndex]?.trim();
          const nomeMulher = row[nomeMulherIndex]?.trim();
          const cpfHomem = row[cpfHomemIndex]?.trim();
          const cpfMulher = row[cpfMulherIndex]?.trim();
          const tamanhoHomem = row[tamanhoHomemIndex]?.trim();
          const tamanhoMulher = row[tamanhoMulherIndex]?.trim();

          if (nomeHomem && cpfHomem) {
            pessoas.push({
              nome: nomeHomem,
              cpf: cpfHomem,
              tamanhoCamiseta: tamanhoHomem || "",
              tipo: "Padrinho",
            });
            console.log("Adicionado Padrinho:", nomeHomem);
          }

          if (nomeMulher && cpfMulher) {
            pessoas.push({
              nome: nomeMulher,
              cpf: cpfMulher,
              tamanhoCamiseta: tamanhoMulher || "",
              tipo: "Madrinha",
            });
            console.log("Adicionada Madrinha:", nomeMulher);
          }
        } else {
          const nome = row[nomeIndex]?.trim();
          const cpf = row[cpfIndex]?.trim();
          const tamanho = row[tamanhoIndex]?.trim();

          if (nome && cpf) {
            pessoas.push({
              nome: nome,
              cpf: cpf,
              tamanhoCamiseta: tamanho || "",
              tipo: "Voluntário",
            });
            console.log("Adicionado Voluntário:", nome);
          } else {
            console.log("Linha ignorada (dados incompletos):", row);
          }
        }
      });

      console.log(
        `Total de pessoas processadas da planilha ${sheetId}: ${pessoas.length}`
      );
    }

    console.log(`Total de pessoas processadas: ${pessoas.length}`);
    return pessoas;
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Busca de Pessoas e Tamanhos de Camisetas
      </h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Buscar Pessoa</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Digite o nome para buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Lista de Pessoas - Quantidade: {pessoasFiltradas.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Tamanho da Camiseta</TableHead>
                    <TableHead>Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pessoasFiltradas.map((pessoa, index) => (
                    <TableRow key={index}>
                      <TableCell>{pessoa.nome}</TableCell>
                      <TableCell>{pessoa.cpf}</TableCell>
                      <TableCell>{pessoa.tamanhoCamiseta}</TableCell>
                      <TableCell>{pessoa.tipo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
