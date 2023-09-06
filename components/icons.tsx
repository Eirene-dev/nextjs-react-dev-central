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
  Image,
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
  type Icon as LucideIcon,
} from "lucide-react"

export type Icon = LucideIcon

export const Icons = {
  logo: ({ ...props }: LucideProps) => (
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 1454 1468">
      <path fill="currentColor" d="M694 185c-.8.5-4 1-7 1-3.1 0-6 .4-6.5.9-.6.5-3.2 1.2-6 1.4-2.7.3-7.5 1.1-10.5 1.7s-7.2 1.4-9.3 1.7c-2 .3-4 .9-4.3 1.4s-2 .9-3.9.9-3.7.4-4 1c-.3.5-1.7 1-3.1 1s-4.4.9-6.6 2c-2.3 1.1-4.8 2-5.5 2s-2.1.4-3.1.9c-.9.6-4.5 2-7.9 3.3-3.5 1.3-6.3 2.6-6.3 3 0 .5-.9.8-2 .8s-2 .4-2 1c0 .5-.6 1-1.4 1-1.7 0-10 4.2-10.4 5.2-.2.5-1.2.8-2.3.8-1 0-1.9.3-1.9.8 0 .4-1.7 1.5-3.7 2.4-3.8 1.7-9.4 4.9-10.3 5.8-.5.5-2.5 1.7-7.5 4.4-1.1.6-2.7 1.9-3.6 2.8-.9 1-2.3 1.8-3 1.8-.8 0-2.1.9-2.9 2s-1.9 2-2.5 2-3.1 1.8-5.5 4-4.8 4-5.2 4c-.5 0-2.4 1.5-4.3 3.4-1.8 1.9-5.1 4.7-7.1 6.2-2.1 1.6-9.2 8.2-15.7 14.7-8.5 8.5-12.3 11.5-13 10.8-.6-.6-2.1-1.1-3.4-1.1s-2.3-.5-2.3-1c0-.6-.7-1-1.5-1s-2.3-.4-3.3-.9c-.9-.5-3-1.4-4.7-2.1-1.6-.7-3.8-1.6-4.7-2.1-1-.5-2.7-.9-3.8-.9s-2-.5-2-1c0-.6-.7-1-1.5-1s-2.4-.5-3.5-1c-1.1-.6-2.9-1.5-4-2-1.1-.6-3.1-1-4.5-1s-2.5-.5-2.5-1c0-.6-1.3-1-2.8-1s-3.2-.4-3.8-.9c-.5-.5-3.4-1.2-6.4-1.5-9.6-.9-14.4-1.7-16.5-2.6-1.1-.5-4.2-1.2-7-1.5-2.7-.3-9.3-1-14.5-1.7-17.9-2.1-41.9-1.3-63 2.2-3.6.6-8.5 1.3-11 1.6s-4.9 1-5.5 1.5c-.5.5-2.4.9-4.1.9-1.8 0-3.6.4-3.9 1-.3.5-1.9 1-3.5 1s-3.2.4-3.5 1c-.3.5-1.9 1-3.6 1-1.6 0-2.9.4-2.9 1 0 .5-1.3 1-3 1-1.6 0-3 .4-3 .8 0 .5-2.3 1.5-5 2.2-2.8.7-5 1.7-5 2.2 0 .4-.9.8-2 .8s-2.9.4-4 1-2.9 1.5-4 2c-1.1.6-2.9 1-4 1s-2 .4-2 1c0 .5-.7 1-1.5 1s-2.3.4-3.3.9c-.9.5-2.8 1.3-4.2 1.8-4.4 1.8-8.4 3.5-10.2 4.4-1 .5-2.5.9-3.3.9s-1.5.4-1.5 1c0 .5-.9 1-2 1s-2 .4-2 1c0 .5-.6 1-1.2 1-1.6 0-18.2 8.2-18.6 9.2-.2.5-1.2.8-2.3.8-1 0-1.9.4-1.9.8s-2.2 1.9-5 3.3c-2.7 1.3-5 2.7-5 3.1 0 .5-.6.8-1.3.8s-2.2.8-3.3 1.7c-1 1-3.1 2.4-4.6 3.2-1.6.8-2.8 1.8-2.8 2.3 0 .4-.9.8-2 .8s-2 .3-2 .8c0 .4-1.8 1.8-4 3.2s-4 2.8-4 3.2c0 .5-.6.8-1.2.8-.7 0-2.9 1.4-4.8 3s-3.9 3-4.3 3c-.5 0-2.2 1.3-3.7 3-1.5 1.6-3.2 3-3.7 3s-2.6 1.6-4.7 3.5-4.2 3.5-4.7 3.5-2.3 1.5-4.1 3.2c-1.8 1.8-5 4.6-7.1 6.2-2.1 1.5-5.3 4.2-7 6-1.8 1.7-4.9 4.3-6.9 5.9-5 3.7-45.6 44.3-53.8 53.7-3.6 4.1-8.1 9.1-10 11s-5.5 6-8 9-6.1 7.1-8 9c-2 1.9-4.7 5.1-6 7-1.4 1.9-3.4 4.5-4.6 5.7-1.2 1.1-4 5.6-6.4 10-4.6 8.3-8.2 13.9-18.4 28.6-3.5 5.1-8.6 12.9-11.5 17.4L10 526h6.6c7.4 0 10.4 1.2 10.4 4 0 1.1.7 2 1.5 2s1.5.4 1.5 1c0 .5.6 1 1.4 1 1.7 0 9.5 4 11.4 5.7.7.7 1.7 1.3 2.1 1.3.5 0 2.4 1.3 4.2 3 1.9 1.6 3.7 3 4.2 3 1 0 17.7 17 17.7 18 0 .4 2 3 4.5 5.6 2.5 2.7 4.5 5.5 4.5 6.1 0 .7.4 1.3.8 1.3.5 0 1.5 1.2 2.3 2.7.8 1.6 2.1 3.5 2.9 4.3s2.1 2.7 2.9 4.2c.8 1.6 1.8 2.8 2.3 2.8.4 0 .8.9.8 2s.4 2 .8 2c.5 0 1.5 1.2 2.3 2.7.8 1.6 2.2 3.7 3.2 4.7.9 1.1 1.7 2.6 1.7 3.3s.4 1.3.9 1.3 1.4 1.3 2.1 3c.7 1.6 1.6 3 2.1 3s.9.6.9 1.3.8 2.2 1.8 3.3c.9 1 2.3 3.1 3.1 4.6.8 1.6 1.8 2.8 2.3 2.8.4 0 .8.7.8 1.5 0 .9.9 2.5 2 3.7s2 2.8 2 3.5.4 1.3.8 1.3 1.6 1.4 2.6 3.2c2.2 3.6 19.2 20.8 20.7 20.8.5 0 2.1 1.1 3.4 2.4 1.3 1.4 3.4 2.7 4.5 3.1 1.1.3 2 1.1 2 1.6s.6.9 1.3.9 2.3.9 3.5 2 2.8 2 3.7 2c.8 0 1.5.4 1.5 1 0 .5.9 1 2 1s2 .4 2 1c0 .5.9 1 1.9 1 1.1 0 2.1.3 2.3.7.8 2 24.2 13.3 27.3 13.3 1.4 0 2.5.4 2.5 1 0 .5.6 1 1.3 1 1.8 0 6.7 2.4 6.7 3.2 0 .5.9.8 2 .8s2 .4 2 1c0 .5.9 1 2 1s2 .4 2 .8c0 .5 1.2 1.5 2.7 2.3 1.6.8 3.7 2.2 4.7 3.1 1.1 1 2.4 1.8 2.9 1.8s1.7.8 2.6 1.8c.9.9 3.4 3 5.5 4.6 2.2 1.7 9.4 8.4 16 15 6.7 6.7 13.7 13.2 15.6 14.6s4.8 3.7 6.4 5.2c1.6 1.6 3.5 2.8 4.2 2.8s1.4.3 1.6.7c.4 1 5.7 4.2 8 5 1 .3 1.8.9 1.8 1.4s.9.9 2 .9 2 .4 2 1c0 .5.9 1 2 1s2 .4 2 1c0 .5.9 1 2 1s2 .4 2 1c0 .5.9 1 2 1s2 .4 2 1c0 .5.9 1 1.9 1 1.1 0 2.3.4 2.6 1 .3.5 1.9 1 3.5 1s3.2.4 3.5 1c.3.5 2.8 1 5.6 1s4.9.5 4.9 1.1c0 1.3 22.7.6 31-1 18.7-3.5 21-4.1 21-5.2 0-1.3 5.8-1.1 6.6.2.3.6 1.1 12.4 1.6 26.2 1.4 35.7 3.7 69.5 5.8 84.2.6 4.4 1.6 11.1 2.1 15 .5 3.8 1.4 10 1.9 13.7 1 7 2.3 16 4 28.3.5 3.8 1.2 9.7 1.6 13 .3 3.3.9 6.9 1.4 8s1.2 4.2 1.5 7c1.2 10.5 1.7 13.5 2.5 13.5.4 0 1 1.9 1.3 4.2.3 2.4 1 6.2 1.6 8.5 2.6 10.1 3 12 3.6 14.8.4 1.6 1 3.9 1.5 5s1.1 3.6 1.5 5.5c.3 1.9 1 5.7 1.6 8.5.5 2.7 1.2 6.6 1.5 8.5s.9 4.4 1.4 5.5c.8 2 1.2 4.4 3.1 19.5 3.5 27.8 3.7 34.9 1.9 61.5-1 15.7-2.2 25.9-4 36-.6 3.3-1.3 8-1.6 10.5s-.9 5.4-1.3 6.5c-1.1 2.6-2.9 9.2-3.5 13-1.5 8.5-1.8 10.2-2.6 12-2 4.7-4.3 20.3-4.2 29 .1 7.9 1.2 15.5 2.3 15.5.5 0 .9.9.9 2s.5 2 1 2c.6 0 1 .7 1 1.6 0 1.8 10.9 12.4 12.7 12.4.7 0 1.3.4 1.3.8s3.2 1.3 7 2c8.9 1.5 75 1.7 75 .2 0-.6 1.8-1 3.9-1 2.2 0 4.3.4 4.6 1 .4.6 12.9 1 34.3 1 27.7 0 34.4-.3 37.7-1.6 2.2-.8 4.8-1.7 5.8-2.1.9-.3 1.7-.9 1.7-1.4s.7-.9 1.6-.9c1.9 0 8.4-6.8 8.4-8.7 0-.7.5-1.3 1-1.3.6 0 1-.9 1-1.9 0-1.1.5-2.3 1-2.6 2.4-1.5.9-20.8-2.1-26.7-.5-1-.9-2.9-.9-4.2s-.3-2.6-.8-2.8c-.4-.1-1.7-3.5-3-7.3-1.3-3.9-2.7-7.9-3.1-9-.5-1.1-1.8-5.4-3.1-9.5-1.2-4.1-2.6-8.9-3.1-10.6s-.9-4.4-.9-6.2c0-1.7-.4-3.4-1-3.7-.5-.3-1-2.1-1-3.9 0-1.7-.4-3.6-.9-4.2-.5-.5-1.2-3.6-1.5-6.9-.4-3.3-1.1-10.1-1.7-15-1.6-12.7-1.6-87.5-.1-99.5 1.8-13.6 3.1-23.8 4.1-32.7 1.5-12.1 2.1-14.5 3.8-13.9.8.3 1.7.6 1.9.6s.4.6.4 1.4c0 1.6 6.1 8 11.5 12.2 2.2 1.6 6.2 5.1 9.1 7.9 5.7 5.6 5.4 4.4 7.3 29.5.4 5.2 1 10.2 1.4 11s.9 7.6 1.2 15c1.4 35.1 1.8 41 2.5 41 .4 0 1.1 4.6 1.4 10.2.4 5.7 1.1 15.9 1.6 22.8.6 6.9 1.4 21.7 1.9 33s1.1 22.3 1.5 24.5c.3 2.2.8 7.2 1 11 .3 3.9.8 8.1 1.3 9.5s.8 6.5.7 11.5c-.1 4.9.2 10.3.7 12 .8 3.1 2.9 26.4 3.4 39 .3 6.7 1.2 13.2 3.5 25.5.6 3 1.3 7 1.7 8.8.3 1.8.9 3.5 1.4 3.8s.9 1.6.9 2.9.5 2.7 1 3c.6.3 1 1.3 1 2.1s.9 3.4 2 5.6c1.1 2.3 2 4.8 2 5.5s.5 1.3 1 1.3c.6 0 1 .9 1 2s.5 2 1 2c.6 0 1 .9 1 2s.5 2 1 2c.6 0 1 .6 1 1.2 0 .7 1.2 2.6 2.6 4.3 1.4 1.6 3.2 4.4 4 6.1s2.4 4.1 3.4 5.2c1.1 1.2 2 2.5 2 3s1.9 2.9 4.3 5.4c2.3 2.5 6 6.5 8.2 8.9 5.1 5.6 12.6 11.9 14.3 11.9.6 0 1.2.4 1.2 1 0 .5.9 1 2 1s2 .4 2 1c0 .5.8 1 1.8 1s2.3.5 3 1.2c1.7 1.7 27.7 1.7 29.4 0 .7-.7 2.2-1.2 3.5-1.2s2.3-.5 2.3-1c0-.6.9-1 2-1s2-.5 2-1c0-.6.6-1 1.3-1 3.3-.1 22.6-19 22.7-22.3 0-.4.9-1.7 2-2.9s2-2.8 2-3.5.5-1.3 1-1.3c.6 0 1-.9 1-2s.5-2 1-2c.6 0 1-.7 1-1.6s1-3.5 2.1-5.8c1.2-2.2 2.5-4.9 3-5.8.5-1 .9-2.5.9-3.3s.4-1.5.8-1.5c.5 0 1.5-2.2 2.2-5 .7-2.7 1.7-5 2.2-5 .4 0 .8-1.4.8-3 0-1.7.5-3 1-3 .6 0 1-1.4 1-3 0-1.7.4-3 .9-3s1.1-1.5 1.4-3.3c.9-5.4 1.8-9.1 2.7-11.2 1-2.3 1.7-7.6 3-23 .6-6.1 1.4-16 2-22 1.3-14.3 2.7-37.9 2.4-38.4-.2-.2-8.5-.3-18.6-.3-12.7 0-16.8-.3-13.3-.8 2.8-.5 11.4-.9 19.3-.9l14.2-.1.2-3.3c.1-3.7.3-4.7 1.1-6.7.9-2.4 1.8-13.2 2.8-33.5.4-10.5 1.3-24 1.8-30 3.8-40.3 5.2-59.4 5.7-75 .2-8.3.7-15.9 1-17 1.1-4 2.5-17.4 3.3-33 .5-8.8 1-16.4 1-16.8.1-.4 1.9-2.6 4.1-4.8s4-4.5 4-4.9c0-.5 1.6-2.5 3.5-4.4 1.9-2 3.5-3.9 3.5-4.4 0-.4 2-2.9 4.4-5.6 4.8-5.3 5.6-4.9 5.6 2.4 0 2.1.5 4.2 1 4.5.6.3 1 3.4 1 6.9 0 3.4.4 6.6.9 7.2.5.5 1.2 3.6 1.5 6.9s1 8.9 1.6 12.5c5.5 32.6 5.5 112.5 0 134-.7 2.5-1.4 6.7-1.7 9.5-.3 2.7-.9 5.4-1.4 5.9-.5.6-.9 2.7-.9 4.7 0 2.1-.4 4.1-1 4.4-.5.3-1 1.9-1 3.5s-.4 3.2-1 3.5c-.5.3-1 1.5-1 2.6 0 1-.4 2.7-.9 3.7-1.6 3.1-2.9 6.6-4.2 10.7-.6 2.2-1.5 4.8-2 5.7-.5 1-.9 2.9-.9 4.2 0 1.4-.4 2.8-1 3.1-.5.3-1 1.7-1 3s-.4 2.7-1 3c-1.4.9-1.2 19.2.3 23.4.6 2 2 4.5 3 5.5.9 1.1 1.7 2.4 1.7 2.9 0 1.8 10.8 9.7 13.4 9.7.8 0 1.8.4 2.1 1 .4.6 14 1 37.6 1 23.9 0 36.9-.4 36.9-1s1.8-1 3.9-1c2.2 0 4.3.4 4.6 1 .9 1.5 64.7 1.3 73.8-.2 4-.6 7.4-1.4 7.7-1.8.3-.3 2.1-1.7 4-3 4.2-2.9 8-7 8-8.8 0-.6.5-1.2 1-1.2.6 0 1-.9 1-2s.5-2 1-2c.6 0 1-1.4 1-3 0-1.7.5-3 1-3 .6 0 1-4.5 1-11.4 0-6.6-.4-11.7-1-12.1-.5-.3-1-2-1-3.7 0-1.8-.4-4.5-.9-6.2-1-3.1-2.4-8.7-4.2-15.9-1.7-7.1-3.3-12.2-4-13.2-.3-.6-.9-2.6-1.2-4.5-.4-1.9-1.1-6-1.7-9-5.2-26.2-6.9-64.3-4.1-93 .6-6.9 1.4-15.7 1.7-19.5.2-3.9.9-7.9 1.4-9 .8-1.9 1.4-5.1 2.6-15.8.3-2.6 1-4.7 1.5-4.7s.9-1.8.9-3.9c0-2.2.4-4.2.9-4.5.8-.6 1.2-2.4 2.7-12.9.3-2.3 1-4.6 1.5-5.1.5-.6.9-2.9.9-5.2 0-2.4.5-4.6 1-4.9.6-.3 1-2.8 1-5.4s.4-5.1.9-5.7c.5-.5 1.2-3.6 1.5-6.9s1-9.4 1.6-13.5 1.5-11.1 2-15.5c.9-7.6 1.6-12.7 4-30.5 5-37 7.3-67.3 9.6-124 .3-8 1-14.9 1.5-15.5.6-.5.9-.5.9.3 0 .7 1.3 1.2 3 1.2s3 .4 3 1c0 .5 1.4 1 3 1 1.7 0 3 .4 3 .9s1.9 1.2 4.3 1.5c2.3.3 7.1 1 10.7 1.7 9.4 1.6 27 2.2 29.4 1 1.2-.5 3.9-1.2 6.1-1.5 6.3-.8 10.8-1.7 13-2.5 3.9-1.6 12.1-5.4 18-8.4 3.3-1.6 7-3.5 8.2-4.1 1.3-.6 2.3-1.4 2.3-1.9 0-.4.9-.7 2-.7s2-.4 2-.8c0-.5 1.2-1.5 2.8-2.3 1.5-.8 3.4-2.1 4.2-2.9.8-.9 3.1-2.7 5-4 1.9-1.4 9.6-8.6 17-16s15.1-14.6 17-16c1.9-1.3 4.4-3.2 5.4-4.2 1.1-1 2.4-1.8 2.8-1.8.5 0 1.8-.9 3-2s2.8-2 3.5-2 1.3-.5 1.3-1c0-.6.6-1 1.3-1s2.3-.9 3.5-2 2.8-2 3.7-2c.8 0 1.5-.5 1.5-1 0-.6.9-1 2-1s2-.5 2-1c0-.6.9-1 2-1s2-.5 2-1c0-.6 1.1-1 2.4-1 1.4 0 2.8-.5 3.1-1 .3-.6 1.7-1 3-1s2.7-.5 3-1c.3-.6 1.5-1 2.6-1 1 0 1.9-.5 1.9-1 0-.6.6-1 1.4-1s3.3-.9 5.5-2c14.1-6.9 20.5-10.3 20.9-11.3.2-.4 1-.7 1.8-.7s2.4-.9 3.6-2 2.8-2 3.5-2 1.3-.5 1.3-1c0-.6.6-1 1.3-1 .6 0 2.5-1.1 4.1-2.5s3.3-2.5 3.7-2.5 1.9-1.1 3.3-2.5 2.9-2.5 3.5-2.5c1.2 0 10.1-8.9 10.1-10.1 0-.5 1.4-2.3 3-4.1 1.7-1.7 3-3.7 3-4.4 0-.8.4-1.4.8-1.4s1.9-2.2 3.3-5c1.3-2.7 2.7-5 3.2-5 .4 0 .7-.7.7-1.5 0-.9.9-2.5 2-3.7s2-2.8 2-3.5.5-1.3 1-1.3c.6 0 1-.9 1-2s.4-2 .9-2 1.4-1.4 2.1-3c.7-1.7 1.6-3 2.1-3s.9-.9.9-2 .4-2 .9-2 1.1-.8 1.4-1.8c.6-1.7 3.7-7.2 4.7-8.2.3-.3 1.1-1.7 1.9-3.3.8-1.5 1.8-2.7 2.3-2.7.4 0 .8-.6.8-1.3 0-.6 1.1-2.5 2.5-4.1s2.5-3.2 2.5-3.6 1.1-2 2.5-3.6 2.5-3.3 2.5-3.8.8-1.6 1.8-2.5c.9-.9 3.7-4.1 6.2-7.1 5.5-6.8 9.4-10.5 13.1-12.7 1.6-1 2.9-2.1 2.9-2.5s.6-.8 1.3-.8 2.3-.9 3.5-2 2.8-2 3.7-2c.8 0 1.5-.5 1.5-1 0-.6.9-1 2-1s2-.4 2-.8 2.1-1.4 4.8-2.1c5.6-1.6 12-5.1 14.6-8 1.8-2 1.8-2.1-1.4-7.8-3.9-6.8-14.5-22-22.4-31.8-3.1-3.9-7-9.7-8.8-13-1.7-3.3-4.3-7.1-5.8-8.5-1.4-1.4-3.7-4.1-5-6s-4.4-5.4-6.7-7.9c-2.4-2.4-4.3-4.8-4.3-5.3 0-.4-2.4-3.1-5.2-6-2.9-3-7.3-7.8-9.8-10.8-5.9-7.2-56.1-57.3-62.5-62.5-2.8-2.2-6.1-5.1-7.5-6.5s-4.1-3.7-6-5c-1.9-1.4-5.3-4.2-7.5-6.2-2.2-2.1-4.3-3.8-4.8-3.8-.4 0-2.1-1.4-3.9-3-1.7-1.7-3.5-3-4-3-.4 0-2.2-1.4-4-3-1.7-1.7-3.5-3-4.1-3-.5 0-1.7-.8-2.6-1.8-.9-.9-2.8-2.3-4.3-3.1-1.6-.8-2.8-1.8-2.8-2.3 0-.4-.6-.8-1.3-.8s-2.2-.8-3.3-1.8c-1-.9-3.1-2.3-4.6-3.1-1.6-.8-2.8-1.8-2.8-2.3 0-.4-.9-.8-1.9-.8-1.1 0-2.1-.3-2.3-.8-.4-.9-5.7-4.1-8-4.9-1-.3-1.8-.9-1.8-1.4s-.9-.9-2-.9-2-.3-2-.8c0-.4-1-1.2-2.3-1.8-6-3-19.4-9.6-20.9-10.5-1-.5-2.5-.9-3.3-.9s-1.5-.5-1.5-1c0-.6-.7-1-1.5-1s-2.4-.5-3.5-1c-1.1-.6-2.9-1.5-4-2-1.1-.6-2.7-1-3.5-1s-1.5-.4-1.5-.8c0-.5-2.2-1.5-5-2.2-2.7-.7-5-1.6-5-2s-2.2-1.3-5-2c-2.7-.7-5-1.6-5-2s-2.2-1.3-5-2c-2.7-.7-5-1.6-5-2s-2.2-1.3-5-2c-2.7-.7-5-1.7-5-2.2 0-.4-1.1-.8-2.4-.8-1.4 0-2.8-.5-3.1-1-.3-.6-1.9-1-3.6-1-1.6 0-2.9-.5-2.9-1 0-.6-1.1-1-2.4-1-1.4 0-2.8-.5-3.1-1-.3-.6-1.9-1-3.4-1s-3.1-.4-3.6-.9c-.6-.5-3-1.2-5.5-1.5s-7.4-1-11-1.6c-17.8-2.9-24-3.4-42.5-3.3-11 0-24 .5-29 1.2-4.9.6-11.4 1.4-14.2 1.7-2.9.3-5.3 1-5.3 1.5s-2 .9-4.4.9c-2.5 0-4.8.4-5.1 1-.3.5-3 1-6 1s-5.7.4-6 1c-.3.5-1.9 1-3.6 1-1.6 0-2.9.4-2.9 1 0 .5-1.3 1-3 1-1.6 0-3 .4-3 1 0 .5-1.3 1-3 1-1.6 0-3 .4-3 1 0 .5-.9 1-2 1s-2.8.4-3.8.9c-.9.5-3 1.4-4.7 2.1-1.6.7-3.8 1.6-4.7 2.1-1 .5-2.5.9-3.3.9s-1.5.4-1.5 1c0 .5-.7 1-1.5 1s-3 .9-5 2-4.2 2-5 2c-.9 0-7.6-6.1-15-13.5S909.6 255 909.1 255s-3-2-5.7-4.5c-2.6-2.5-5.2-4.5-5.7-4.5s-1.7-.8-2.6-1.8-3.2-2.9-5.1-4.2c-1.9-1.4-4.4-3.2-5.4-4.2-1.1-1-2.6-1.8-3.3-1.8s-1.3-.4-1.3-.8c0-.5-1.2-1.5-2.7-2.3-1.6-.8-3.7-2.2-4.7-3.2-1.1-.9-2.5-1.7-3.2-1.7s-1.4-.3-1.6-.8c-.4-.9-5.7-4.1-8-4.9-1-.3-1.8-.9-1.8-1.4s-.9-.9-2-.9-2-.3-2-.8c0-.4-1-1.2-2.3-1.8-1.2-.6-6.9-3.5-12.7-6.3-5.8-2.9-11.3-5.6-12.2-6.1-1-.6-2.5-1-3.3-1s-2.3-.4-3.3-.9c-4.7-2.4-13.1-5.1-16-5.1-1.1 0-2.4-.5-2.7-1-.3-.6-2.2-1-4.1-1s-3.4-.5-3.4-1c0-.6-1.8-1-3.9-1-2.2 0-4.3-.5-4.6-1-.3-.6-2.3-1-4.4-1-2 0-4.1-.4-4.6-.9-.6-.5-3.2-1.2-6-1.5-2.7-.3-8.4-1-12.5-1.7-10.1-1.4-62-2.2-64-.9zM136.7 510.2c.6 1.3 1.4 3.1 1.7 4 .4 1.3 1.6 1.8 4.1 1.8 4.1 0 4.7 2.2 1.4 5.1-1.8 1.5-2.1 2.6-1.7 6.4.5 3.8.3 4.5-1.1 4.5-1 0-2.7-.9-3.9-2-1.9-1.8-2.5-1.9-4.4-.8-1.3.7-2.5 1.6-2.8 1.9s-1.7.9-3.2 1.3c-2.9.7-3.6-.2-1.7-2.1s1.4-7.2-.9-9.2c-3.3-2.8-2.8-5.1 1-5.1 3.2 0 6.8-2.4 6.8-4.5 0-1.2 2-3.5 3-3.5.4 0 1.1 1 1.7 2.2zm71.9-.8c.8.8 1.4 2.1 1.4 2.8 0 2.4 2.3 3.8 6.2 3.8 4.7 0 5.1 2.3.8 4.8-2.3 1.3-3 2.4-3 4.7 0 1.7.5 3.6 1.1 4.2.7.7.9 1.9.5 2.8-.5 1.3-1 1.4-2.8.4-1.2-.6-3-2-4.1-3-1.6-1.4-2.4-1.5-4.3-.7-1.3.6-2.4 1.4-2.4 1.8s-1 1-2.1 1.3c-2 .5-2.1.3-1.6-4 .4-3.9.1-4.8-1.9-6.6-3.7-3.2-3.2-5.7 1.2-5.7 3.6 0 6.4-1.8 6.4-4.2 0-1.3 1.9-3.8 2.8-3.8.2 0 1 .6 1.8 1.4zm74.7 2.6c1.5 3.6 2.1 4 5.2 4 2.7 0 3.5.4 3.5 1.8 0 1-.9 2.4-2 3.2-1.6 1.1-2 2.6-2 6.7 0 5.6-.8 6.4-3.5 3.7-1.8-1.8-7.4-2.2-8.4-.6-.3.5-1.6 1.2-2.8 1.6-2.1.7-2.2.5-1.6-4.3.5-4.7.4-5.2-2.6-7.6-1.7-1.5-3.1-3.1-3.1-3.5 0-.5 2.1-1 4.7-1.2 4.2-.3 4.8-.6 6.6-4.1 1-2 2.4-3.7 3.1-3.7.6 0 1.9 1.8 2.9 4zm72.5-1.2c.4 2.4 4.7 5.2 8.2 5.2 3 0 2.5 2.8-1.2 6.2-2.2 1.9-2.9 3.1-2 3.5.6.2 1.2 1.8 1.2 3.4 0 2.2-.5 2.9-2 2.9-1.1 0-2-.5-2-1 0-1.8-7.4-1-10 1-1.4 1.1-2.8 2-3.2 2-1.2 0-1-4.8.2-5.5 1.7-1 1.1-5.5-.7-6.2-2.5-1-4.3-2.9-4.3-4.7 0-1 1.3-1.6 4.3-1.8 3.7-.3 4.4-.7 6.2-4.1 2.2-4.1 4.8-4.6 5.3-.9zm753.7 1c1.6 2.9 2.7 3.8 5.3 4 3.8.4 4.2 2.6 1 5.3-1.7 1.5-2.1 2.9-1.9 6.9.1 2.8-.2 5-.6 5-.5 0-2.5-1.1-4.6-2.6l-3.7-2.5-3.3 2.3c-1.7 1.2-3.3 2.6-3.5 3s-.8.8-1.3.8c-1.2 0-1.2-4.7.1-5.5 2-1.3 1-5.7-2-8.5-1.6-1.5-3-3.1-3-3.4s1.8-.6 4-.6c4.3 0 8-2.9 8-6.2 0-3.2 3.4-2 5.5 2zm74.1-.1c1.8 3.4 2.5 3.8 6.2 4.1 5.1.4 5.5 2.3 1.2 4.9-2.3 1.3-3 2.4-3 5 0 1.7.5 3.5 1 3.8 1.2.8 1.3 4.5.1 4.5-.4 0-2.1-1-3.6-2.1-3.4-2.7-8.1-2.7-10.4 0-2.8 3.2-3.4 2.5-2.7-2.9.6-4.5.4-5.2-1.9-7.2-3.8-3.3-3.3-5.8 1.1-5.8 3.5 0 6.4-1.8 6.4-4 0-1.2 2.1-3.9 3.1-4 .3 0 1.4 1.7 2.5 3.7zm74.4.3c0 2.1 2.8 4 6 4 2.8 0 3.1.3 2.5 2.2-.4 1.3-1.5 2.9-2.6 3.7-2 1.4-2.5 4.6-.9 5.6s1.2 4.5-.5 4.5c-.9 0-2.5-.9-3.7-2-2.3-2.1-4.8-2.7-4.8-1 0 .5-.5 1-1.1 1s-2.4.9-4 2.1l-2.9 2v-2.5c0-1.5.5-3.5 1.2-4.5 1-1.7.7-2.4-2-4.9-4.5-4.2-4.2-6.2.8-6.2 3.5 0 4.3-.4 6.6-4 2.2-3.3 2.8-3.7 4-2.5.8.7 1.4 1.9 1.4 2.5zm73.5-.2c1.7 3.1 2.6 3.7 5.8 4 4.4.4 4.6 1.2 1.2 4.6-2 2-2.5 3.5-2.5 7.6 0 5.2-.8 6-3.4 3.5-.8-.8-2.1-1.5-2.9-1.5-.9 0-1.7-.6-1.9-1.2-.3-.9-1.6-.5-4.1 1.2-2 1.4-3.7 2.8-3.7 3.2 0 .5-.4.8-1 .8-.5 0-1-1.1-1-2.4 0-1.4.5-2.8 1-3.1 2.1-1.3 1-6-2-8.4-1.7-1.3-3-2.7-3-3.2s2.2-.9 4.8-.9c4.3 0 5-.3 6.2-2.8 1.8-3.4 3.1-5.2 3.9-5.2.3 0 1.5 1.7 2.6 3.8zM175.4 576.5c1 1.4 2.4 2.5 3 2.5s1.8.4 2.6 1c1.2.7 1.1 1.2-.8 2.8-1.5 1.3-2.2 3.1-2.2 5.6 0 3.5-2 5-3.5 2.6-.3-.6-1.7-1-3-1s-2.7.4-3 1c-.3.5-1.2 1-2 1-1 0-1.2-.9-.8-3.5.5-2.9.1-3.9-1.7-5.5-3.1-2.7-2-5 2.5-5 2.8 0 3.5-.4 3.5-2 0-2.8 3.1-2.5 5.4.5zm71-1.3c.7.7 1.5 2.1 1.9 3 .4 1.1 1.7 1.8 3.2 1.8 3 0 3.2 1.1.5 3-1.4 1-2 2.6-2 5.2 0 3.1-.4 3.8-2 3.8-1.1 0-2-.5-2-1 0-.6-1.3-1-3-1-1.6 0-3 .4-3 1 0 .5-.4 1-1 1-.5 0-1-1.6-1-3.6 0-2.5-.7-4.3-2.1-5.5-2.3-1.9-1.7-4.1.9-3.8 2.8.3 5.2-1.2 5.2-3.2 0-2.2 2.5-2.5 4.4-.7zm72.9.8c.7 1 2.5 2.4 4 2.9 3.3 1.3 3.4 2.7.5 5.8-1.7 1.8-1.9 2.6-1 3.5.7.7 1.2 1.8 1.2 2.5 0 1.5-3.6 1.8-4.5.3-.3-.6-1.7-1-3.1-1-1.3 0-2.4.4-2.4 1 0 .5-.9 1-2 1-1.7 0-2-.7-2-4 0-2.2-.4-4-.9-4-1.3 0-2.1-2.7-1.5-4.5.4-.8 1.8-1.5 3.3-1.5s3.3-.9 4.1-2c1.8-2.5 2.5-2.5 4.3 0zm828.7-.4c0 2.3 2.5 4.4 5.4 4.4 3.1 0 3.3 1 .6 3-1.4 1-2 2.6-2 5.2 0 3.1-.4 3.8-2 3.8-1.1 0-2-.5-2-1 0-.6-1.3-1-3-1-1.6 0-3 .4-3 1 0 .5-.9 1-2 1-2.2 0-2.6-2-1-4.9.7-1.4.5-2.3-1-3.6-3.1-2.8-2.6-5.5 1-5.5 1.9 0 3.4-.7 4.2-2 1.5-2.4 4.8-2.7 4.8-.4zm72.4-.4c.7.7 1.5 2.1 1.9 3 .4 1.1 1.7 1.8 3.2 1.8 3 0 3.2 1.1.5 3.5-1.2 1.1-2 3.1-2 5.2 0 2.6-.4 3.3-2 3.3-1.1 0-2-.5-2-1 0-.6-1.1-1-2.4-1-1.4 0-2.8.4-3.1 1-.3.5-1.5 1-2.6 1-1 0-1.9-.5-1.9-1 0-.6.5-1 1-1 1.8 0 1.1-4.6-1-6.5-2.4-2.1-2.6-3.5-.5-3.5 2.8 0 6.5-2.4 6.5-4.2 0-2.1 2.5-2.4 4.4-.6zm75.5 1.9c1.3 1.6 3 2.8 3.7 2.5 2.4-.9 2.7 1.5.5 3.8-1.6 1.7-2 3-1.6 4.9.8 3.2-1 4.3-4.2 2.6-1.9-1-2.8-1-4.3-.1-3.6 2.2-4.9 1.5-4.3-2.3.5-2.8.1-3.9-1.7-5.5-2-1.7-2.1-2.1-.7-3.5.9-.8 2.6-1.5 3.9-1.5s2.9-.9 3.6-2c1.6-2.7 2.3-2.5 5.1 1.1zm-113.1 59.6c.6 1.5 1.2 3.3 1.2 4 0 .8 1.3 1.3 3.6 1.3 4.4 0 7.2 2.3 5.2 4.3-.7.7-2.1 1.6-3.2 2-1.9.7-1.9 3.8-.1 9.4 1 3-1.7 3.1-4.7.3-2.8-2.6-5.2-2.5-8.8.2s-4.8 1.8-3.2-2.5c1.2-3 1-3.4-2.3-6.5-5-4.7-4.5-6 2.5-7.2 2.8-.4 3.9-1.3 5.5-4.3 1.1-2 2.2-3.7 2.5-3.7s1.1 1.2 1.8 2.7zM209 638.5c.8 1.9 1.9 3.5 2.6 3.5 2.5 0 6.4 2.3 6.4 3.8 0 .7-.9 1.6-2 1.9-1.7.5-2 1.4-2 6.4 0 6.6-1.3 7.5-5.2 3.9-1.2-1.1-3.1-2-4.3-2-1.1 0-2.7.9-3.5 2-1.5 2.1-5 2.8-5 1 0-.6.5-1 1-1 .6 0 1-2 1-4.5s-.4-4.5-.8-4.5c-.5 0-2-.9-3.3-2.1-2.7-2.4-1.8-3.4 4.2-4.4 2.6-.5 4-1.4 5-3.3 1.4-2.6 2.8-4.2 4-4.2.3 0 1.1 1.6 1.9 3.5zm147.8.5c.8 1.7 2 3 2.7 3 2.2 0 6.5 2.2 6.5 3.3 0 .5-1.1 2-2.5 3.3-2.2 2-2.4 2.8-1.9 6.8.8 5.2-.7 6.1-4.4 2.6-2.6-2.5-4-2.5-7.2 0-3.3 2.6-6 2.6-6 0 0-1.1.5-2 1-2 1.8 0 1.2-7-.7-7.7-1-.4-2.4-1.3-3.1-2-2-1.9.8-4.3 5.1-4.3 3 0 3.7-.5 5.1-3.5 1.9-3.9 3.5-3.8 5.4.5zm751.9-.5c.9 1.9 2.2 3.5 2.8 3.5 1.6 0 6.5 2.4 6.5 3.2 0 .9-2.7 3.5-4.8 4.7-1.4.8-1.5 1.4-.4 4.3.6 1.9 1.2 4 1.2 4.6 0 1.9-3.4 1.4-5-.8-.8-1.1-2.6-2-4.1-2-1.4 0-3.4.9-4.4 2s-2.4 2-3.2 2c-1.6 0-1.7-4.3-.2-7.1.8-1.7.5-2.5-2-4.8-4.7-4.4-4.1-6.1 1.8-6.1 4.6 0 5-.2 6.5-3.5.9-1.9 2.1-3.5 2.7-3.5.5 0 1.7 1.6 2.6 3.5zm-825.7.4c1 2.4 1.9 3 4.8 3.3 4.6.4 5.6 3.6 1.9 6.1-2.2 1.4-2.4 2.1-1.9 6.6.5 5.7-1 6.8-4.3 3.1-1-1.1-3-2-4.4-2-1.5 0-3.3.9-4.1 2-1.5 2.1-5 2.8-5 1 0-.6.5-1 1-1 .6 0 1-1.7 1-3.9 0-3.1-.6-4.3-3.2-6.5-3.1-2.5-3.1-2.6-1.2-4.1 1-.8 3.3-1.5 5-1.5 2.5 0 3.4-.6 4.4-3 1.6-3.9 4.4-3.9 6-.1zm975-1.1c0 2.5 1.9 4.2 4.8 4.2 1.3 0 3 .7 3.9 1.5 1.3 1.4 1.1 1.9-1.8 4.6-3.1 2.8-3.2 3.2-2.1 6.3.7 1.8 1.2 3.8 1.2 4.4 0 1.9-2.9 1.4-5.2-.8-2.3-2.1-6.8-2.7-6.8-1 0 .5-.9 1-1.9 1-1.1 0-2.1.6-2.4 1.2-.2.7-.8 1-1.2.6-.5-.5-.2-2.6.5-4.8 1.3-3.9 1.3-4-2.1-7-3.9-3.4-3.2-4.5 3.1-5.6 2.7-.4 3.9-1.3 4.9-3.5 1.4-3.3 5.1-4.1 5.1-1.1zM610.8 753.6c8.1.6 8.3.7 8.9 3.5.3 1.6.9 2.9 1.4 2.9s.9 1.5.9 3.4.4 3.7.9 4 1.1 2 1.4 3.8 1.2 6 2 9.3c2.8 11 3.9 19.9 3.4 27-1.5 18.4-3.6 28.7-8.1 38.8-.8 1.8-2 4.7-2.7 6.4-.8 1.8-1.7 3.3-2.1 3.3-.5 0-.8.9-.8 2s-.3 2-.8 2c-.4 0-1.8 2.5-3.1 5.5s-3.7 6.8-5.2 8.5c-1.6 1.6-2.9 3.7-2.9 4.5s-.4 1.5-.8 1.5c-.5 0-1.5 1.2-2.3 2.7-.8 1.6-2.1 3.5-2.9 4.3-.9.8-2.6 3-3.9 4.8-2.5 3.6-14.2 16.2-20.5 22.1-2.1 2-5.9 5.5-8.4 7.8-2.5 2.4-5 4.3-5.6 4.3-.7 0-1.8.9-2.6 2s-1.9 2-2.5 2c-.5 0-2.3 1.1-3.9 2.5-1.6 1.3-3.7 2.7-4.7 3-1.1.4-1.9 1.1-1.9 1.6s-.9.9-1.9.9c-1.1 0-2.1.3-2.3.7-.4 1.1-8.7 5.3-10.4 5.3-.8 0-1.4.4-1.4 1 0 .5-.9 1-1.9 1-1.1 0-2.3.4-2.6 1-.3.5-1.7 1-3 1s-2.6.4-2.9.9-2 1.2-3.8 1.5c-1.8.4-5.5 1.2-8.3 1.8-5.5 1.2-35.2 1.4-42.7.3-2.7-.4-4.8-1.1-4.8-1.6s-1.1-.9-2.4-.9c-1.4 0-2.8-.5-3.1-1-.3-.6-1.5-1-2.6-1-1 0-1.9-.5-1.9-1 0-.6-.9-1-2-1s-2-.5-2-1c0-.6-.7-1-1.5-1-1.9 0-9.1-6.4-15.7-13.9-10-11.3-13.7-31.9-7.7-43.3.5-1 .9-2.5.9-3.3s.5-1.5 1-1.5c.6 0 1-.6 1-1.4 0-1.9 10.5-12.6 12.4-12.6.9 0 1.6-.5 1.6-1 0-.6 1.4-1 3-1 1.7 0 3-.5 3-1 0-1.4 14.2-1.3 17.7.1 6.4 2.6 8 3.6 11.8 7.4 5.8 5.9 8.5 12.1 8.5 20.1 0 5.7-1.9 13.4-3.3 13.4-.5 0-.5.4-.2 1 .3.5 1.7 1 3 1s2.7-.5 3-1c.3-.6 2.4-1 4.5-1s4.2-.5 4.5-1c.3-.6 1.9-1 3.6-1 1.6 0 2.9-.5 2.9-1 0-.6 1.1-1 2.4-1 1.4 0 2.8-.5 3.1-1 .3-.6 1.5-1 2.6-1 1 0 1.9-.5 1.9-1 0-.6.6-1 1.3-1 1.8 0 6.7-2.4 6.7-3.3 0-.4.9-.7 2-.7s2-.5 2-1c0-.6.6-1 1.4-1 .7 0 2.7-1.4 4.4-3 1.8-1.7 3.6-3 4.1-3 1.5 0 20.5-19.2 22.7-22.8 1-1.8 2.1-3.2 2.5-3.2s1.2-1.4 1.9-3c.7-1.7 1.6-3 1.9-3 1 0 9.1-16.4 9.1-18.4 0-.9.5-1.6 1-1.6.6 0 1-.6 1-1.3s.9-3.2 2-5.5c1.1-2.2 2-5.2 2-6.6s.5-2.8 1-3.1c.6-.3 1-2.1 1-4s.5-3.7 1-4c.6-.3 1-2.4 1-4.5s.5-4.2 1-4.5c.6-.3 1-3.3 1-6.5s.4-6.1.9-6.4c.4-.3 1.1-5.2 1.5-10.8.7-12.3 1.6-22.9 2-24.3.3-1 4.4-.8 26.4 1.1zm247.7 2.6c.3 2.4 1.1 6.5 1.6 9.3.4 2.7 1.1 6.8 1.4 9 .4 2.2 1 4.9 1.5 6 .9 2.2 1.8 6.6 2.7 13.2.3 2.4.9 4.3 1.4 4.3s.9 1.8.9 3.9c0 2.2.5 4.3 1 4.6.6.3 1 2.2 1 4.1s.5 3.4 1 3.4c.6 0 1 1.5 1 3.4s.5 3.8 1 4.1c.6.3 1 1.6 1 2.7 0 2.3 1.7 8.1 3.1 11 .5 1 .9 2.9.9 4.3s.5 2.5 1 2.5c.6 0 1 1.3 1 3 0 1.6.5 3 1 3 .6 0 1 1.1 1 2.4 0 1.4.4 2.7.8 3s1.4 2.8 2.2 5.5c.7 2.8 1.7 5.1 2.2 5.1.4 0 .8.9.8 2s.5 2 1 2c.6 0 1 .9 1 2s.4 2 .9 2 1.1.8 1.4 1.7c.7 2.3 3.7 7.2 6 9.7.9 1.1 1.7 2.4 1.7 2.9 0 1.3 15.9 16.8 18.9 18.5 1.3.8 3.9 2.2 5.8 3.3 1.8 1 4.2 1.9 5.1 1.9 1 0 2.2.4 2.8.9 1.2 1.1 10.9 2 12.4 1.1.9-.6.9-1.3.1-2.8-1.4-2.6-1.5-17.2-.1-17.2.6 0 1-.7 1-1.5 0-3.6 11.3-14.5 15-14.5 1 0 2.2-.5 2.5-1 .8-1.2 16.9-1.3 19.3-.1.9.5 2.9 1.4 4.3 2 5.8 2.7 14.1 12.4 15.9 18.5.6 2.3 1.6 5.5 2.1 7.2 2.2 7.5.1 17.5-6.2 28.4-2 3.5-12.9 14.3-16.1 15.9-1.6.8-2.8 1.8-2.8 2.3 0 .4-.9.8-2 .8s-2 .4-2 1c0 .5-1.1 1-2.4 1-1.4 0-2.8.4-3.1 1-.3.5-1.7 1-3 1s-2.6.4-2.9.9c-.6.9-12.7 2.4-20.6 2.5-4.8 0-11.2-.8-24.3-3-2-.3-4-1-4.3-1.5s-1.6-.9-3-.9c-1.3 0-2.4-.5-2.4-1 0-.6-.9-1-2-1s-2-.5-2-1c0-.6-.9-1-2-1s-2-.5-2-1c0-.6-.9-1-2-1s-2-.5-2-1c0-.6-.6-1-1.3-1s-2.2-.8-3.3-1.9c-1.1-1-3-2.4-4.3-3-5.3-2.9-23.3-20.9-29.2-29.2-1.3-1.9-3.1-4.3-4.1-5.3-1-1.1-1.8-2.4-1.8-2.8 0-.5-.9-1.8-2-3s-2-2.8-2-3.5-.4-1.3-.9-1.3-1.1-.8-1.4-1.8c-1.2-3.8-5.8-10.2-7.4-10.2-.9 0-6.3-11.5-6.3-13.5 0-.8-.4-1.7-1-2-.5-.3-1-1.5-1-2.6 0-1-.4-1.9-1-1.9-.5 0-1-.7-1-1.5s-.9-3.4-1.9-5.8c-1.8-3.9-4.2-10.9-7.1-21.2-2-7.1.1-26.9 4.9-46 .6-2.2 1.3-5.4 1.7-7 .4-1.7 1-3.5 1.4-4 .3-.6 1.2-3 1.9-5.5s1.7-5.3 2.2-6.2c.5-1 .9-2.6.9-3.5.1-4.7 5.1-7.3 13.8-7.3 3.1 0 6.4-.5 7.2-1 2.4-1.5 2.7-1.2 3.5 3.2zm-163.7 459.5c-1 .2-2.6.2-3.5 0-1-.3-.2-.5 1.7-.5s2.7.2 1.8.5z"/>
    </svg>
  ),
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
  twitter: Twitter,
  check: Check,
}