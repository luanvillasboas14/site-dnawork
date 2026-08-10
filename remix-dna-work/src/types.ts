export interface Job {
  id: string;
  title: string;
  area: 'Tech' | 'Comercial' | 'Administrativo' | 'Operacional' | 'Outros';
  modality: 'Remoto' | 'Híbrido' | 'Presencial';
  salary: string;
  type: string; // e.g. "Estágio", "Trainee", "Jovem Aprendiz"
  benefits: string[];
  location: string;
  company: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'cadu';
  text: string;
  timestamp: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  quote: string;
  type: 'candidate' | 'company';
}
