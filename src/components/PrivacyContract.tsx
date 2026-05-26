import { useState } from 'react';
import { PRIVACY_CONTRACT_TEXT } from '../data';
import { Shield, FileText, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface PrivacyContractProps {
  onAgree?: () => void;
  hasAgreed?: boolean;
  showCheckboxOnly?: boolean;
}

export default function PrivacyContract({ onAgree, hasAgreed = false, showCheckboxOnly = false }: PrivacyContractProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (showCheckboxOnly) {
    return (
      <div className="flex items-start gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-xs hover:border-emerald-500/30 transition-colors">
        <input
          id="privacy-checkbox"
          type="checkbox"
          checked={hasAgreed}
          onChange={onAgree}
          className="mt-1 h-4 w-4 rounded-sm border-neutral-700 bg-neutral-800 text-emerald-500 focus:ring-emerald-500"
          required
        />
        <div className="text-neutral-400">
          He leído y acepto los términos y condiciones plasmados en el{' '}
          <button
            type="button"
            className="text-emerald-400 underline hover:text-emerald-300 font-medium"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Aviso de Privacidad Legal de la Taquería
          </button>
          .
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg hover:shadow-black/40 transition-all duration-300">
      <div 
        className="flex items-center justify-between p-4 bg-gradient-to-r from-neutral-900 to-neutral-950 border-b border-neutral-800 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-100 text-sm md:text-base">Aviso de Privacidad Legal</h3>
            <p className="text-xs text-neutral-500">Obligatorio de conformidad con la Ley de Protección de Datos</p>
          </div>
        </div>
        <button className="text-neutral-500 hover:text-neutral-300">
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 bg-neutral-950 max-h-72 overflow-y-auto border-b border-neutral-800 text-xs font-mono text-neutral-400 leading-relaxed space-y-4 whitespace-pre-line select-none">
          {PRIVACY_CONTRACT_TEXT}
        </div>
      )}

      <div className="p-4 bg-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          {hasAgreed ? (
            <span className="flex items-center gap-1.5 text-emerald-500 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 animate-pulse">
              <CheckCircle2 className="h-4 w-4" /> Contrato de Privacidad Aceptado y Firmado
            </span>
          ) : (
            <span className="text-amber-500 font-medium bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/25">
              ⚠️ Requiere Firma / Aceptación
            </span>
          )}
        </div>
        
        {onAgree && !hasAgreed && (
          <button
            type="button"
            onClick={onAgree}
            className="w-full md:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/25"
          >
            <Shield className="h-4 w-4" /> Firmar y Aceptar Aviso
          </button>
        )}
      </div>
    </div>
  );
}
