import { type LucideProps, Waves, Bot, Mic } from "lucide-react"

export const Icons = {
  Logo: (props: LucideProps) => (
    <div className="flex items-center gap-2" {...props}>
      <Waves className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl font-bold">ScribeAI</span>
    </div>
  ),
  Bot: (props: LucideProps) => <Bot {...props} />,
  Mic: (props: LucideProps) => <Mic {...props} />,
}
