import { Navigation } from "@/config/navigation"

export const findNavigationByName = (name: string) => {
  return Navigation.urls.find(nav => nav.name.toLowerCase() === name.toLowerCase())
}

export const findNavigationsByName = (list: string[]) => {
  return Navigation.urls.filter(nav => list.toString().toLowerCase().includes(nav.name.toLowerCase()))
}

