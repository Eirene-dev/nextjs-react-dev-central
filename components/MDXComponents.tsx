import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import { Callout } from '@/components/callout'
import { MdxCard } from '@/components/mdx-card'
import {
  StyleBlueBold,
  StyleImportant,
  StyleUnderline,
  StyleWarning,
} from '@/components/StyledComponents'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Command,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Laptop,
  Loader2,
  LucideProps,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
  ShieldAlert,
  Info,
  type Icon as LucideIcon,
} from 'lucide-react'

import DonutChart from './DonutChart'
import MermaidChart from './MermaidChart'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm,
  Callout,
  Card: MdxCard,
  ShieldAlert,
  Info,
  FileText,
  StyleBlueBold,
  StyleImportant,
  StyleUnderline,
  StyleWarning,
  DonutChart,
  MermaidChart,
}
