"use client";

import React, { useState } from "react";
import { Database, Clock, CheckCircle, AlertTriangle, ShieldCheck, Code2, Play } from "lucide-react";

interface Slot {
  time: string;
  status: "available" | "booked" | "selected";
  client?: string;
}

const COURTS = [
  { id: "beach-1", name: "Beach Tennis Central", type: "Areia", price: "R$ 120/h" },
  { id: "padel-1", name: "Padel Coberto", type: "Vidro", price: "R$ 160/h" },
  { id: "futsal-1", name: "Futsal Society", type: "Grama Sintética", price: "R$ 200/h" },
];

export const ArenaSaasSandbox: React.FC = () => {
  const [selectedCourt, setSelectedCourt] = useState(COURTS[0].id);
  const [slots, setSlots] = useState<Record<string, Slot[]>>({
    "beach-1": [
      { time: "08:00 - 09:00", status: "booked", client: "Torneio Master" },
      { time: "09:00 - 10:00", status: "available" },
      { time: "10:00 - 11:00", status: "available" },
      { time: "14:00 - 15:00", status: "booked", client: "Aula Particular" },
      { time: "18:00 - 19:00", status: "available" },
      { time: "19:00 - 20:00", status: "available" },
    ],
    "padel-1": [
      { time: "08:00 - 09:00", status: "available" },
      { time: "10:00 - 11:00", status: "booked", client: "Dupla Avançada" },
      { time: "17:00 - 18:00", status: "available" },
      { time: "18:00 - 19:00", status: "booked", client: "Campeonato" },
      { time: "19:00 - 20:00", status: "available" },
    ],
    "futsal-1": [
      { time: "09:00 - 10:00", status: "available" },
      { time: "15:00 - 16:00", status: "available" },
      { time: "19:00 - 20:00", status: "booked", client: "Pelada da Terça" },
      { time: "20:00 - 21:00", status: "booked", client: "Liga Regional" },
    ],
  });

  const [activeTab, setActiveTab] = useState<"sandbox" | "djangoCode">("sandbox");
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const handleSelectSlot = (index: number) => {
    const currentSlots = [...slots[selectedCourt]];
    const targetSlot = currentSlots[index];

    if (targetSlot.status === "booked") {
      setNotification({
        type: "error",
        text: `HTTP 409 Conflict: O horário ${targetSlot.time} já está reservado por "${targetSlot.client}". Prevenção de overbooking ativada.`,
      });
      return;
    }

    // Reserva o horário no sandbox
    currentSlots[index] = {
      ...targetSlot,
      status: "booked",
      client: "Você (Simulador Recrutador)",
    };

    setSlots((prev) => ({
      ...prev,
      [selectedCourt]: currentSlots,
    }));

    setNotification({
      type: "success",
      text: `HTTP 201 Created: Agendamento confirmado com sucesso para ${targetSlot.time} via transação atômica Django!`,
    });
  };

  return (
    <div id="arena-saas" className="my-16 scroll-mt-20">
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0F172A]/70 border border-[#A855F7]/25 backdrop-blur-md">
        {/* Header da Seção */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20">
                <Database className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                SaaS de Arenas Esportivas (Django REST + Concorrência)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Backend construído em <strong>Python / Django REST Framework</strong> com controle de locks transacionais contra overbooking.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-2 bg-[#080B11] p-1 rounded-xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("sandbox")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === "sandbox"
                  ? "bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sandbox Interativo
            </button>
            <button
              onClick={() => setActiveTab("djangoCode")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                activeTab === "djangoCode"
                  ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Código Django (Lock)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Sandbox Interativo */}
        {activeTab === "sandbox" && (
          <div className="mt-6 space-y-6">
            {/* Seletor de Quadras */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {COURTS.map((court) => (
                <button
                  key={court.id}
                  onClick={() => {
                    setSelectedCourt(court.id);
                    setNotification(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedCourt === court.id
                      ? "bg-[#A855F7]/15 border-[#A855F7]/60 shadow-lg shadow-[#A855F7]/10"
                      : "bg-[#080B11]/50 border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>{court.name}</span>
                    <span className="text-[#A855F7] font-mono">{court.price}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono mt-1">
                    Tipo: {court.type}
                  </div>
                </button>
              ))}
            </div>

            {/* Notificação de Status */}
            {notification && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2.5 animate-fade-in ${
                  notification.type === "success"
                    ? "bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]"
                    : "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444]"
                }`}
              >
                {notification.type === "success" ? (
                  <CheckCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{notification.text}</span>
              </div>
            )}

            {/* Grid de Horários */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
                <span>Horários Disponíveis (Clique para reservar ou testar conflito):</span>
                <span className="text-[#A855F7]">Ambiente Demo Sanitizado</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {slots[selectedCourt].map((slot, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSlot(idx)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      slot.status === "booked"
                        ? "bg-[#EF4444]/10 border-[#EF4444]/30 hover:border-[#EF4444]/60"
                        : "bg-white/[0.03] border-white/10 hover:border-[#A855F7]/50 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs font-mono font-medium text-white">
                        {slot.time}
                      </span>
                    </div>

                    <div>
                      {slot.status === "booked" ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30">
                          Ocupado ({slot.client})
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                          Disponível
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destaque de Engenharia */}
            <div className="p-4 rounded-xl bg-[#080B11]/50 border border-white/5 text-[11px] font-mono text-gray-400 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <span>
                <strong>Engenharia de Concorrência:</strong> O backend utiliza <code>select_for_update()</code> com transação atômica <code>@transaction.atomic</code> no PostgreSQL para travar o registro da quadra antes de verificar sobreposições de horários, eliminando completamente condições de corrida (race conditions) em picos de agendamento.
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Código Django */}
        {activeTab === "djangoCode" && (
          <div className="mt-6 bg-[#080B11] p-4 sm:p-5 rounded-2xl border border-white/10 overflow-x-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs font-mono text-gray-400">
              <span>services/booking_service.py (Atomic Concurrency Control)</span>
              <span className="text-[#38BDF8]">Django REST & PostgreSQL</span>
            </div>
            <pre className="text-xs font-mono text-gray-300 leading-relaxed overflow-x-auto">
{`from django.db import transaction
from rest_framework.exceptions import ValidationError
from .models import Agendamento, Quadra

@transaction.atomic
def reservar_horario_seguro(quadra_id, inicio, fim, usuario):
    """
    Garante integridade ACID ao alugar uma quadra esportiva.
    O lock pessimista no registro da quadra impede que duas requisições
    simultâneas reservem a mesma faixa de horário.
    """
    quadra = Quadra.objects.select_for_update().get(id=quadra_id)
    
    # Valida conflito de agenda na faixa solicitada
    conflito = Agendamento.objects.filter(
        quadra=quadra,
        status='CONFIRMADO',
        inicio__lt=fim,
        fim__gt=inicio
    ).exists()
    
    if conflito:
        raise ValidationError({
            "code": "OVERBOOKING_PREVENTED",
            "detail": "Horário já reservado por outro atleta."
        })
        
    novo_agendamento = Agendamento.objects.create(
        quadra=quadra,
        usuario=usuario,
        inicio=inicio,
        fim=fim,
        status='CONFIRMADO'
    )
    
    return novo_agendamento`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
