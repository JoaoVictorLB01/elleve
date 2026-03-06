import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, Users, Layers, FileVideo, Plus, Edit, Trash2, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { courses } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

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
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl font-bold mb-2">
            Painel <span className="text-gradient-cosmic">Administrativo</span>
          </h1>
          <p className="text-muted-foreground mb-8">Gerencie cursos, módulos e alunos</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-gradient-cosmic text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
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
            <div className="flex items-center justify-between mb-6">
              <Input placeholder="Buscar cursos..." className="max-w-sm" />
              <Button className="bg-gradient-cosmic">
                <Plus className="mr-2 h-4 w-4" />
                Novo Curso
              </Button>
            </div>
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="border border-border rounded-xl bg-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.instructor} • {course.duration}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{course.modules.length} módulos</Badge>
                      <Badge variant="outline">
                        {course.modules.reduce((a, m) => a + m.lessons.length, 0)} aulas
                      </Badge>
                      <Badge className="bg-accent/10 text-accent border-0">
                        {course.enrolledStudents} alunos
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "alunos" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <Input placeholder="Buscar alunos..." className="max-w-sm" />
            </div>
            <div className="border border-border rounded-xl bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-medium">Aluno</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">E-mail</th>
                    <th className="text-left p-4 font-medium">Cursos</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Progresso</th>
                  </tr>
                </thead>
                <tbody>
                  {["Ana Silva", "Carlos Santos", "Maria Luz", "Pedro Estrela"].map((name, i) => (
                    <tr key={name} className="border-b border-border last:border-0">
                      <td className="p-4 font-medium">{name}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">
                        {name.toLowerCase().replace(" ", ".")}@email.com
                      </td>
                      <td className="p-4">{i + 1}</td>
                      <td className="p-4 hidden md:table-cell">{[45, 78, 20, 92][i]}%</td>
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
              { label: "Total de Alunos", value: "1.216", icon: Users },
              { label: "Cursos Ativos", value: "3", icon: BookOpen },
              { label: "Aulas Concluídas", value: "4.523", icon: FileVideo },
            ].map((stat) => (
              <div key={stat.label} className="border border-border rounded-xl bg-card p-6">
                <stat.icon className="h-6 w-6 text-primary mb-3" />
                <div className="text-3xl font-bold font-display mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
