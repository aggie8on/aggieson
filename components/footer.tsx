"use client"

import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from "lucide-react"
import { useEffect, useState } from "react"

type Weather = { temperature: number; code: number }

function WeatherIcon({ code }: { code: number }) {
  const iconProps = { size: 13, strokeWidth: 1.5 }
  if (code === 0) return <Sun {...iconProps} />
  if ([1, 2].includes(code)) return <CloudSun {...iconProps} />
  if (code === 3) return <Cloud {...iconProps} />
  if ([45, 48].includes(code)) return <CloudFog {...iconProps} />
  if ([51, 53, 55, 56, 57].includes(code)) return <CloudDrizzle {...iconProps} />
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <CloudRain {...iconProps} />
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow {...iconProps} />
  if ([95, 96, 99].includes(code)) return <CloudLightning {...iconProps} />
  return <CloudSun {...iconProps} />
}

function LocalConditions() {
  const [time, setTime] = useState("--:--")
  const [weather, setWeather] = useState<Weather | null>(null)

  useEffect(() => {
    const updateTime = () => {
      setTime(new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Kampala",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).format(new Date()))
    }
    updateTime()
    const clock = window.setInterval(updateTime, 30_000)

    const loadWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=1.08&longitude=34.17&current=temperature_2m,weather_code&timezone=Africa%2FKampala",
          { cache: "no-store" },
        )
        if (!response.ok) return
        const data = await response.json()
        if (typeof data.current?.temperature_2m === "number" && typeof data.current?.weather_code === "number") {
          setWeather({ temperature: data.current.temperature_2m, code: data.current.weather_code })
        }
      } catch {
        // Keep the footer usable if the weather service is unavailable.
      }
    }
    void loadWeather()
    const refresh = window.setInterval(() => void loadWeather(), 30 * 60 * 1000)

    return () => {
      window.clearInterval(clock)
      window.clearInterval(refresh)
    }
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs tabular-nums text-muted-foreground">
      <span>{time}</span>
      <span className="text-muted-foreground/60">EAT</span>
      <span>Mbale, Uganda</span>
      <span className="inline-flex items-center gap-1.5" aria-label={weather ? `${Math.round(weather.temperature)} degrees Celsius in Mbale` : "Weather in Mbale loading"}>
        {weather ? <><WeatherIcon code={weather.code} /><span>{Math.round(weather.temperature)}°C</span></> : <><CloudSun size={13} strokeWidth={1.5} /><span>--°C</span></>}
      </span>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-background">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <LocalConditions />
        <span className="text-xs text-muted-foreground">People, Places & Moments</span>
      </div>
    </footer>
  )
}
