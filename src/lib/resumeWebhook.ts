import { ResumeDraft } from '../components/resume/types';

export async function sendResumeLead(draft: ResumeDraft) {
  const response = await fetch('/api/curriculo-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...draft, photoUrl: '' }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'Não foi possível baixar agora. Tente de novo.');
  }
  if (!data?.pdfUrl || typeof data.pdfUrl !== 'string') {
    throw new Error('Não foi possível gerar o PDF.');
  }

  const file = await fetch(data.pdfUrl);
  if (!file.ok) throw new Error('Não foi possível baixar o PDF.');
  const blob = await file.blob();
  const link = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = 'curriculo.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
