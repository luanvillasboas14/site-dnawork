import { ResumeDraft } from './types';
// @ts-ignore
import logoFinal from '../../assets/images/Logo Final (1).png';

type Props = {
  data: ResumeDraft;
  watermark?: boolean;
};

function lines(value: string) {
  return value.split('\n').map((line) => line.trim()).filter(Boolean);
}

function contactLine(data: ResumeDraft) {
  const place = [data.neighborhood, data.city, data.state].filter(Boolean).join(', ');
  return [data.phone, data.email, place, data.cep ? `CEP ${data.cep}` : '', data.birthDate ? `Nasc. ${data.birthDate}` : '']
    .filter(Boolean)
    .join(' · ');
}

function period(start: string, end: string, current: boolean) {
  if (!start && !end) return '';
  return `${start} — ${current ? 'Atual' : end}`;
}

export function ResumePreview({ data, watermark = false }: Props) {
  const color = data.color;
  const compact = data.model === 'compacto';
  const text = compact ? 'text-[11px]' : 'text-[12px]';
  const title = compact ? 'text-[10px]' : 'text-[11px]';
  const centered = data.model === 'classico';
  const sidebar = data.model === 'lateral' || data.model === 'barra-direita';
  const timeline = data.model === 'linha-do-tempo';
  const minimal = data.model === 'minimalista';

  const body = (
    <div className={minimal ? 'space-y-5' : compact ? 'space-y-2' : 'space-y-3'}>
      {data.objective && (
        <section>
          <h3 className={`${title} font-bold tracking-wide border-b pb-1`} style={{ color, borderColor: color }}>OBJETIVO PROFISSIONAL</h3>
          <p className={`mt-1 text-slate-700 leading-relaxed whitespace-pre-wrap ${text}`}>{data.objective}</p>
        </section>
      )}
      {data.experience.some((item) => [item.company, item.role, item.city, item.start, item.end, item.activities].some((value) => value.trim())) && (
        <section>
          <h3 className={`${title} font-bold tracking-wide border-b pb-1`} style={{ color, borderColor: color }}>HISTÓRICO PROFISSIONAL</h3>
          <div className="mt-1 space-y-2">
            {data.experience.filter((item) => [item.company, item.role, item.city, item.start, item.end, item.activities].some((value) => value.trim())).map((item) => (
              <article key={item.id} className={timeline ? 'border-l-2 pl-3' : ''} style={timeline ? { borderColor: color } : undefined}>
                <div className="flex justify-between gap-3">
                  <p className={`font-bold text-slate-900 ${text}`}>{item.role || item.company}</p>
                  <p className={`shrink-0 text-slate-500 ${text}`}>{period(item.start, item.end, item.current)}</p>
                </div>
                <p className={`text-slate-600 ${text}`}>{[item.company, item.city].filter(Boolean).join(' · ')}</p>
                <ul className="mt-1 space-y-0.5">
                  {lines(item.activities).map((line) => (
                    <li key={line} className={`text-slate-700 ${text}`}>• {line}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}
      {data.education.some((item) => [item.course, item.institution, item.startYear, item.endYear].some((value) => value.trim())) && (
        <section>
          <h3 className={`${title} font-bold tracking-wide border-b pb-1`} style={{ color, borderColor: color }}>FORMAÇÃO ACADÊMICA</h3>
          <div className="mt-1 space-y-1.5">
            {data.education.filter((item) => [item.course, item.institution, item.startYear, item.endYear].some((value) => value.trim())).map((item) => (
              <div key={item.id} className="flex justify-between gap-3">
                <div>
                  <p className={`font-bold text-slate-900 ${text}`}>{item.course || item.level}</p>
                  <p className={`text-slate-600 ${text}`}>{[item.institution, item.level, item.status].filter(Boolean).join(' · ')}</p>
                </div>
                <p className={`shrink-0 text-slate-500 ${text}`}>{[item.startYear, item.endYear].filter(Boolean).join(' — ')}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {data.skills.length > 0 && !sidebar && (
        <section>
          <h3 className={`${title} font-bold tracking-wide border-b pb-1`} style={{ color, borderColor: color }}>COMPETÊNCIAS</h3>
          <ul className="mt-1 space-y-0.5">
            {data.skills.map((skill) => (
              <li key={skill} className={`text-slate-700 ${text}`}>• {skill}</li>
            ))}
          </ul>
        </section>
      )}
      {data.languages.some((item) => item.name.trim()) && (
        <section>
          <h3 className={`${title} font-bold tracking-wide border-b pb-1`} style={{ color, borderColor: color }}>IDIOMAS</h3>
          {data.languages.filter((item) => item.name.trim()).map((item) => (
            <p key={item.id} className={`mt-0.5 text-slate-700 ${text}`}>{[item.name, item.level].filter(Boolean).join(' · ')}</p>
          ))}
        </section>
      )}
      {data.certificates.some((item) => item.name.trim() || item.issuer.trim() || item.year.trim()) && (
        <section>
          <h3 className={`${title} font-bold tracking-wide border-b pb-1`} style={{ color, borderColor: color }}>CURSOS E CERTIFICAÇÕES</h3>
          {data.certificates.filter((item) => item.name.trim() || item.issuer.trim() || item.year.trim()).map((item) => (
            <p key={item.id} className={`mt-0.5 text-slate-700 ${text}`}>{[item.name, item.issuer, item.year].filter(Boolean).join(' · ')}</p>
          ))}
        </section>
      )}
      {data.affiliations && <Extra title="AFILIAÇÕES" text={data.affiliations} color={color} titleClass={title} textClass={text} />}
      {data.achievements && <Extra title="CONQUISTAS" text={data.achievements} color={color} titleClass={title} textClass={text} />}
      {data.extra && <Extra title="INFORMAÇÕES ADICIONAIS" text={data.extra} color={color} titleClass={title} textClass={text} />}
      {data.links && <Extra title="SITES E LINKS" text={data.links} color={color} titleClass={title} textClass={text} />}
    </div>
  );

  const initials = data.name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const headerName = (
    <div className={`${centered ? 'text-center' : ''} ${data.model === 'moderno' ? '-mx-6 -mt-6 mb-4 bg-[#FFF4E8] px-6 py-4' : ''}`}>
      <div className={`flex gap-3 ${centered ? 'justify-center' : 'items-center'}`}>
        {(data.photoUrl || data.model === 'moderno') && (
          data.photoUrl ? (
            <img src={data.photoUrl} alt="" className="h-12 w-12 rounded-md object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-md text-sm font-black text-white" style={{ backgroundColor: color }}>
              {initials || 'AP'}
            </div>
          )
        )}
        <div>
          <h2 className={`${compact ? 'text-lg' : 'text-xl'} font-black text-slate-900`}>{data.name}</h2>
          <p className={`mt-0.5 text-slate-500 ${text}`}>{contactLine(data)}</p>
        </div>
      </div>
    </div>
  );

  const side = (
    <aside className="p-4 text-white space-y-3" style={{ backgroundColor: color }}>
      <p className="text-xs font-bold">{data.name}</p>
      <p className="text-[11px] leading-relaxed">{contactLine(data)}</p>
      {data.skills.length > 0 && (
        <div>
          <p className="text-[10px] font-bold tracking-wide">COMPETÊNCIAS</p>
          <ul className="mt-1 space-y-0.5 text-[11px]">
            {data.skills.map((skill) => <li key={skill}>• {skill}</li>)}
          </ul>
        </div>
      )}
    </aside>
  );

  return (
    <article id="resume-preview" className={`relative overflow-hidden bg-white text-slate-900 shadow-xl break-words [overflow-wrap:anywhere] ${compact ? 'p-4' : 'p-6'} min-h-full`}>
      {data.model === 'executivo' && (
        <div className="-mx-6 -mt-6 mb-4 px-6 py-4 text-white" style={{ backgroundColor: color }}>
          <h2 className="text-2xl font-black">{data.name}</h2>
          <p className="text-xs mt-1 text-white/90">{contactLine(data)}</p>
        </div>
      )}
      {sidebar ? (
        <div className={`grid -m-6 min-h-full ${data.model === 'barra-direita' ? 'grid-cols-[1fr_180px]' : 'grid-cols-[180px_1fr]'}`}>
          {data.model === 'lateral' && side}
          <div className="p-6">{headerName}{body}</div>
          {data.model === 'barra-direita' && side}
        </div>
      ) : (
        <>
          {data.model !== 'executivo' && headerName}
          <div className="mt-4">{body}</div>
        </>
      )}
      {watermark && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center" aria-hidden="true">
          <img src={logoFinal} alt="" className="w-3/4 max-w-lg opacity-20" />
        </div>
      )}
    </article>
  );
}

function Extra({ title, text, color, titleClass, textClass }: { title: string; text: string; color: string; titleClass: string; textClass: string }) {
  return (
    <section>
      <h3 className={`${titleClass} font-bold tracking-wide border-b pb-1`} style={{ color, borderColor: color }}>{title}</h3>
      {lines(text).map((line) => (
        <p key={line} className={`mt-0.5 text-slate-700 ${textClass}`}>{line}</p>
      ))}
    </section>
  );
}

