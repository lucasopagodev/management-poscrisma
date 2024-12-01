"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DetailDialog } from "@/components/detail-dialog";

type SheetData = string[][];

const VISIBLE_COLUMNS = [
  "Nome Completo",
  "CPF ou RG",
  "Número de telefone",
  "Data de Nascimento",
  "Sexo",
  "Casal Padrinho ou Catequista",
];

export default function Home() {
  const [data, setData] = useState<SheetData>([]);
  const [filteredData, setFilteredData] = useState<SheetData>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterField, setFilterField] = useState<string>("Nome");
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<string[] | null>(null);

  useEffect(() => {
    // Se a lista de VISIBLE_COLUMNS não estiver vazia, define o primeiro valor como padrão
    if (VISIBLE_COLUMNS.length > 0) {
      setFilterField(VISIBLE_COLUMNS[0]);
    }
  }, []);

  useEffect(() => {
    fetch("/api/sheets?id=1")
      .then((res) => res.json())
      .then((result) => {
        if (Array.isArray(result.data) && result.data.length > 0) {
          setData(result.data);
          setFilteredData(result.data.slice(1));
        } else {
          setData([]);
          setFilteredData([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao carregar os dados:", error);
        setIsLoading(false);
        setData([]);
        setFilteredData([]);
      });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const headers = data[0];
      const headerIndex = headers.findIndex(
        (header) => header.toLowerCase() === filterField.toLowerCase()
      );

      if (headerIndex !== -1) {
        const filtered = data.slice(1).filter((row) => {
          const cellValue = row[headerIndex];
          return (
            cellValue &&
            cellValue.toLowerCase().includes(filterValue.toLowerCase())
          );
        });
        setFilteredData(filtered);
      } else {
        setFilteredData(data.slice(1));
      }
    } else {
      setFilteredData([]);
    }
  }, [data, filterField, filterValue]);

  const handleFilterFieldChange = (value: string) => {
    setFilterField(value);
    setFilterValue("");
  };

  const getVisibleColumnIndexes = () => {
    return VISIBLE_COLUMNS.map((column) => data[0].indexOf(column)).filter(
      (index) => index !== -1
    );
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Dados da Planilha de Afilhados
      </h1>
      {isLoading ? (
        <p>Carregando...</p>
      ) : data.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <Select onValueChange={handleFilterFieldChange} value={filterField}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Selecione o campo" />
              </SelectTrigger>
              <SelectContent>
                {VISIBLE_COLUMNS.map((header, index) => (
                  <SelectItem key={index} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder={`Filtrar por ${filterField}`}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-full sm:max-w-sm"
            />
          </div>
          <ScrollArea className="h-[calc(100vh-250px)] w-full">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {VISIBLE_COLUMNS.map((header, index) => (
                      <TableHead key={index} className="min-w-[150px]">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((row, index) => {
                    const visibleIndexes = getVisibleColumnIndexes();
                    return (
                      <TableRow
                        key={index}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => setSelectedRow(row)}
                      >
                        {visibleIndexes.map((colIndex) => (
                          <TableCell key={colIndex}>{row[colIndex]}</TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {selectedRow && (
            <DetailDialog
              isOpen={!!selectedRow}
              onClose={() => setSelectedRow(null)}
              data={selectedRow}
              headers={data[0]}
            />
          )}
        </>
      ) : (
        <p>Nenhum dado encontrado.</p>
      )}
    </div>
  );
}
