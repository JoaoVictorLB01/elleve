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
    { id: "estatisticas" as Tab, label: "Estatísticas", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-2 block">
            Administração
          </span>
          <h1 className="font-display text-3xl font-bold">
            Painel de Controle
          </h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 rounded-xl bg-muted/50 border border-border w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Courses Tab */}
        {activeTab === "cursos" && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar cursos..." className="pl-10 h-11 rounded-xl" />
              </div>
              <Button variant="cosmic" size="sm">
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
                  className="border border-border rounded-2xl bg-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-primary/20 transition-colors"
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {course.instructor} • {course.duration}
                    </p>
                    <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{course.modules.length} módulos</span>
                      <span>•</span>
                      <span>{course.modules.reduce((a, m) => a + m.lessons.length, 0)} aulas</span>
                      <span>•</span>
                      <span className="text-accent">{course.enrolledStudents} alunos</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "alunos" && (
          <div>
            <div className="relative w-full sm:max-w-sm mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar alunos..." className="pl-10 h-11 rounded-xl" />
            </div>
            <div className="border border-border rounded-2xl bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider">Aluno</th>
                    <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">E-mail</th>
                    <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider">Cursos</th>
                    <th className="text-left p-4 font-medium text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">Progresso</th>
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
                      <td className="p-4 hidden md:table-cell">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className="border border-border rounded-2xl bg-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-accent">{stat.change}</span>
                </div>
                <div className="text-3xl font-bold font-display mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
