import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Users, FileVideo, Plus, Edit, Trash2, BarChart3, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { courses } from "@/data/mockData";

type Tab = "cursos" | "alunos" | "estatisticas";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>("cursos");

  const tabs = [
    { id: "cursos" as Tab, label: "Cursos", icon: BookOpen },
    { id: "alunos" as Tab, label: "Alunos", icon: Users },
    { id: "estatisticas" as Tab, label: "Stats", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <span className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-widest mb-1.5 sm:mb-2 block">
            Administração
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Painel de Controle
          </h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 sm:mb-8 p-1 rounded-xl bg-muted/50 border border-border w-full sm:w-fit overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex-1 sm:flex-initial whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Courses Tab */}
        {activeTab === "cursos" && (
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5 sm:mb-6">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar cursos..." className="pl-10 h-10 sm:h-11 rounded-xl text-sm" />
              </div>
              <Button variant="cosmic" size="sm" className="w-full sm:w-auto">
                <Plus className="mr-1.5 h-4 w-4" />
                Novo Curso
              </Button>
            </div>
            <div className="space-y-3">
              {courses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border border-border rounded-xl sm:rounded-2xl bg-card p-3.5 sm:p-5 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-xs sm:text-sm truncate">{course.title}</h3>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                            {course.instructor} • {course.duration}
                          </p>
                        </div>
                        <div className="flex gap-1.5 sm:gap-2 shrink-0">
                          <Button variant="outline" size="icon" className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl">
                            <Edit className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl text-destructive hover:text-destructive">
                            <Trash2 className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground">
                        <span>{course.modules.length} módulos</span>
                        <span>•</span>
                        <span>{course.modules.reduce((a, m) => a + m.lessons.length, 0)} aulas</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline text-accent">{course.enrolledStudents} alunos</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "alunos" && (
          <div>
            <div className="relative w-full sm:max-w-sm mb-5 sm:mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar alunos..." className="pl-10 h-10 sm:h-11 rounded-xl text-sm" />
            </div>
            
            {/* Mobile: card layout */}
            <div className="sm:hidden space-y-3">
              {["Ana Silva", "Carlos Santos", "Maria Luz", "Pedro Estrela"].map((name, i) => (
                <div key={name} className="border border-border rounded-xl bg-card p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{name}</span>
                    <span className="text-xs text-muted-foreground">{i + 1} curso(s)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-2">
                    {name.toLowerCase().replace(" ", ".")}@email.com
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-cosmic"
                        style={{ width: `${[45, 78, 20, 92][i]}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">{[45, 78, 20, 92][i]}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table layout */}
            <div className="hidden sm:block border border-border rounded-2xl bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider">Aluno</th>
                    <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">E-mail</th>
                    <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider">Cursos</th>
                    <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider">Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  {["Ana Silva", "Carlos Santos", "Maria Luz", "Pedro Estrela"].map((name, i) => (
                    <tr key={name} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-medium">{name}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">
                        {name.toLowerCase().replace(" ", ".")}@email.com
                      </td>
                      <td className="p-4">{i + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-cosmic"
                              style={{ width: `${[45, 78, 20, 92][i]}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{[45, 78, 20, 92][i]}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "estatisticas" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { label: "Total de Alunos", value: "1.216", icon: Users, change: "+12%" },
              { label: "Cursos Ativos", value: "3", icon: BookOpen, change: "+1" },
              { label: "Aulas Concluídas", value: "4.523", icon: FileVideo, change: "+340" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="border border-border rounded-xl sm:rounded-2xl bg-card p-5 sm:p-6"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <stat.icon className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
                  <span className="text-[10px] sm:text-xs font-medium text-accent">{stat.change}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-display mb-0.5 sm:mb-1">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
