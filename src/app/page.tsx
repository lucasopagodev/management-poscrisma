import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-4 sm:p-8">
      <div className="w-full max-w-5xl space-y-6">
        {/* Título Principal */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl sm:text-4xl text-primary font-bold">
              Bem-vindo ao Gerenciamento Pós-Crisma PNSE
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm sm:text-lg">
              Todas as informações são coletadas a partir dos formulários
              preenchidos.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Seções de Formulários e Planilhas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Formulários */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-primary">
                Formulários
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Links para acessar os formulários de afilhados e padrinhos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                asChild
                variant="link"
                className="text-blue-600 hover:underline"
              >
                <a
                  href="https://forms.gle/aPzamLNUzhVPHvPV6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Formulário dos Afilhados
                </a>
              </Button>
              <Button
                asChild
                variant="link"
                className="text-blue-600 hover:underline"
              >
                <a
                  href="https://forms.gle/YHibXywpGfNoNNv46"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Formulário dos Padrinhos e Voluntários
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Planilhas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-primary">
                Planilhas
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Links para visualizar as planilhas com os dados coletados.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                asChild
                variant="link"
                className="text-blue-600 hover:underline"
              >
                <a
                  href="https://docs.google.com/spreadsheets/d/1nSpAgpdgys5b-wCNqPSI2q-7G7petgLS_Zb8KqT5Gwc/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Planilha dos Afilhados
                </a>
              </Button>
              <Button
                asChild
                variant="link"
                className="text-blue-600 hover:underline"
              >
                <a
                  href="https://docs.google.com/spreadsheets/d/13xmZ79Vm9JAgeOmA4O1JgbPKn68CRAVFP-F5787XSvA/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Planilha dos Padrinhos e Voluntários
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
