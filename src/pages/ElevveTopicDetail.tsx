import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Play, Lock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useElevveVideos } from "@/hooks/useElevveVideos";
import { useAuth } from "@/contexts/AuthContext";
import AuthGateModal from "@/components/AuthGateModal";
import ElevveVideoManager from "@/components/ElevveVideoManager";
import { extractStoragePath, getSignedFileUrl } from "@/lib/storage";

const allTopics = [
  { id: "familia", title: "Elevve sua família", accentHsl: "265 55% 55%" },
  { id: "relacionamento", title: "Elevve seu relacionamento", accentHsl: "320 60% 55%" },
  { id: "vida-amorosa", title: "Elevve sua vida amorosa", accentHsl: "280 50% 60%" },
  { id: "financeira", title: "Elevve sua vida financeira", accentHsl: "40 82% 62%" },
  { id: "autoestima", title: "Autoestima e confiança", accentHsl: "45 90% 58%" },
  { id: "emocoes", title: "Inteligência emocional", accentHsl: "200 70% 55%" },
  { id: "criatividade", title: "Criatividade e imaginação", accentHsl: "330 65% 60%" },
  { id: "valores", title: "Valores e empatia", accentHsl: "280 50% 58%" },
];

const ElevveTopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { data: videos = [], isLoading } = useElevveVideos(topicId);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);

  const topic = allTopics.find((t) => t.id === topicId);
  const activeVideo = videos.find((v) => v.id === activeVideoId);
  const isEmbedUrl = activeVideo?.video_url?.includes("youtube.com") || activeVideo?.video_url?.includes("vimeo.com");

  // Auto-select first video
  useEffect(() => {
    if (videos.length > 0 && !activeVideoId) {
      setActiveVideoId(videos[0].id);
    }
  }, [videos, activeVideoId]);

  // Resolve signed URL
  useEffect(() => {
    if (!activeVideo?.video_url || isEmbedUrl) {
      setResolvedUrl(activeVideo?.video_url || null);
      return;
    }
    const storagePath = extractStoragePath(activeVideo.video_url, "course-media");
    if (storagePath && user) {
      getSignedFileUrl("course-media", storagePath).then((url) => {
        setResolvedUrl(url || activeVideo.video_url || null);
      });
    } else {
      setResolvedUrl(activeVideo.video_url);
    }
  }, [activeVideo?.video_url, isEmbedUrl, user]);

  if (!topic) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-muted-foreground">
        Tópico não encontrado
      </div>
    );
  }

  const handleVideoClick = (videoId: string) => {
    if (!user) {
      setShowAuthGate(true);
      return;
    }
    setActiveVideoId(videoId);
  };

  return (
    <main className="min-h-screen pt-20 pb-24 md:pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <Link to="/elevve-se" className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-bold">{topic.title}</h1>
            <p className="text-xs text-muted-foreground">{videos.length} vídeo(s)</p>
          </div>
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={() => setShowManager(true)} className="text-xs">
              <Settings className="h-3.5 w-3.5 mr-1" /> Gerenciar
            </Button>
          )}
        </motion.div>

        {/* Video Player */}
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <div className="aspect-video w-full bg-muted/50 rounded-2xl overflow-hidden border border-border">
              {user ? (
                isEmbedUrl ? (
                  <iframe
                    src={activeVideo.video_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={activeVideo.title}
                  />
                ) : resolvedUrl ? (
                  <video
                    src={resolvedUrl}
                    className="w-full h-full"
                    controls
                    controlsList="nodownload"
                    title={activeVideo.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <p className="text-sm">Vídeo não disponível</p>
                  </div>
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium">Faça login para assistir</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h2 className="text-base sm:text-lg font-bold">{activeVideo.title}</h2>
              {activeVideo.duration && (
                <p className="text-xs text-muted-foreground mt-1">{activeVideo.duration}</p>
              )}
              {activeVideo.description && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{activeVideo.description}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Video List */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <Play className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum vídeo disponível ainda.</p>
            {isAdmin && (
              <Button variant="cosmic" size="sm" className="mt-4" onClick={() => setShowManager(true)}>
                Adicionar Vídeos
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Todos os vídeos</h3>
            {videos.map((video, i) => {
              const isActive = video.id === activeVideoId;
              return (
                <motion.button
                  key={video.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => handleVideoClick(video.id)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    isActive
                      ? "border-primary/30 bg-primary/5"
                      : "border-border hover:border-primary/15 hover:bg-muted/20"
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(145deg, hsl(${topic.accentHsl} / ${isActive ? 0.2 : 0.1}), hsl(${topic.accentHsl} / 0.03))`,
                    }}
                  >
                    {user ? (
                      <Play className="h-4 w-4" style={{ color: `hsl(${topic.accentHsl})` }} />
                    ) : (
                      <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? "text-foreground" : ""}`}>
                      {video.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{video.duration || "—"}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/50 shrink-0">{i + 1}/{videos.length}</span>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {showAuthGate && (
        <AuthGateModal
          open={showAuthGate}
          onClose={() => setShowAuthGate(false)}
          redirectTo={`/elevve-se/${topicId}`}
        />
      )}

      {showManager && (
        <ElevveVideoManager
          topicId={topicId!}
          topicTitle={topic.title}
          onClose={() => setShowManager(false)}
        />
      )}
    </main>
  );
};

export default ElevveTopicDetail;
