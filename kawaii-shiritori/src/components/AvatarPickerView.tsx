import React from "react";
import { PlayerProfile, OpponentBot } from "../types";
import { motion } from "motion/react";
import { ArrowRight, Edit, Upload, User, Sparkles, Check, Gamepad2 } from "lucide-react";

interface AvatarPickerProps {
  initialProfile: PlayerProfile;
  opponents: OpponentBot[];
  onConfirm: (profile: PlayerProfile, selectedBot: OpponentBot) => void;
}

const AVATAR_OPTIONS = [
  {
    name: "Neko",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuANOuGrOsv-96XQvI8bosq_UYcnNGdxDKm5cOF2YbrvU1TWSXsQvqqqDS4bVFmwbRDeWP4shfrZmDoXtHB3gt-9IJJITzse1D_ewjhj3qT-paPy294Mz5tih9ZdTEGRa-1chVf5KhcVghmhCvUGqQppn9DFqiQvq1gT1wE0GO0Ac5b15y8tju5B5TTWmXgZeg2ysTvNs_UqjgtaKDCqvK68L8-TWauBjqCXJacIiX80f33WvQ2maDkrMR3v9xaMaCfTi-YQA5YXO6Jj",
  },
  {
    name: "Shiba",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDv2_dSmuLzNIvq77bleM6yYK1w2nskbF-805BwE30p1TCTfPqHucQDAhM51009utAwsM6gOV0Pf4wEKJ7SxEX9Zv2R7bHUD9Y48kWy2ryoViyezxrLRkfiMgWMXsgiswNZmqFEyeSZFvAUfS-BjXK2NuUE1tD4HE6ks_DU_weW0RR9jrg9ESv15u3kPcSXDOMX7jQdFtaqgPe82uxThMpWFrN0mLCMa8PEBZTMiDunmvltqaE4mghXOTvBoEhYqMx7RPt3lUshKVvY",
  },
  {
    name: "Bunny",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5Lg5SU1xKaPIp0mM--d-Cep1T93IrZoLObvX2XNsHO8P-sgdUN8q_D1v5DWfBUXEkKW59oJtJcM0q8o4_1jT5XFM9M3Mu3amwXXKFMPfo_S6MscBlMqBrO4sDHxvHNL1KlKIXI91sYZkaYd-X8aH6yzGf6ABkJUT1E2QAQnPRZLZ0C9c67gWNbWx6hmp-2oMyST2EHB4FLVV-XvbRz-RXEZegVx39CKMnsJnPtoetEXNsOdQjg-KTjAmi2s2j1M3NOXlLjHtcDQo7",
  },
  {
    name: "Panda",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFRYI5dsRRAnSJV4BppuP-eap7bMIE9mKy65rz08TBAULgei4Nofz3ln4LLTJfnHXvxtI-k4mEBCtsri257VesEzQ_eAxT9XBju7KMfc8NepRD17o5rkW1rgB16wNNM83jLvs7I1Xt238IFjgIhxUJFFqePYlA3i9H0cDZwrLONCXS_lJlAFQyEWosSLb5-jZUzarDzM2vKfIA6q8FTDBOM41TYWjdxEtc1nFCSjBYamaJZItiEsKZreGwqaOW1KWuVddOmpiTur0p",
  },
  {
    name: "Fox",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiUGinuf2_gEvw9lg5ziXpJoQjS-EeUXJC9gLJzBVu-t_8T8IzvBA59uUGDh2nOF1RVA69aXXq4cV93HG3vK63mPS5tLLq8UOiG1SRTrOG8BLiJsmY-uR4C6rSRFy3o5bNmAyaRF40RFn70d0YeGD62DLDNWyXfODBbQMQvJVcs4VF39YgKjYfQhTxjMt2QcD5GkKlzMc82brS_TiSv3euPOO9TQX8hPd7Gj5KMPY9ai1Cd98Kmn92TA--FlZqnuwS3kAVtI023Bs4",
  },
  {
    name: "Pikachu",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  },
  {
    name: "Charizard",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
  },
  {
    name: "Squirtle",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
  },
  {
    name: "Bulbasaur",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  },
  {
    name: "Eevee",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
  },
  {
    name: "Mewtwo",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
  },
  {
    name: "Snorlax",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png",
  },
  {
    name: "Jigglypuff",
    url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png",
  },
  {
    name: "Leonardo",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnBGc7sxBqvE8yDhUqMQYXNHSR_1y_Y8Nz5TKf1tN2s0P4yP4rg7QyE7vZQjRqtZ0ZU8hMC7qW5sR7bYS4tHwqZZr0Xh0LGqZqZZqZ",
  },
  {
    name: "Raphael",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKQYRB1sVWNx8PqFqH5yqHqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH",
  },
  {
    name: "Michelangelo",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYZPqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5",
  },
  {
    name: "Donatello",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7GfqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH5yqH",
  },
];

export default function AvatarPickerView({
  initialProfile,
  opponents,
  onConfirm,
}: AvatarPickerProps) {
  const [profile, setProfile] = React.useState<PlayerProfile>(initialProfile);
  const [selectedBot, setSelectedBot] = React.useState<OpponentBot>(opponents[0]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSelectAvatar = (url: string) => {
    setProfile(prev => ({ ...prev, avatarUrl: url }));
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          handleSelectAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentOpLevelClass = (bot: OpponentBot) => {
    if (bot.id === selectedBot.id) {
      if (bot.difficulty === "easy") return "border-secondary bg-secondary-container/20";
      if (bot.difficulty === "medium") return "border-tertiary-container bg-tertiary-fixed/30";
      return "border-primary bg-primary-container/20";
    }
    return "border-transparent bg-surface hover:bg-surface-container-low";
  };

  const getDifficultyColor = (diff: "easy" | "medium" | "hard") => {
    if (diff === "easy") return "bg-secondary text-on-secondary";
    if (diff === "medium") return "bg-tertiary-container text-on-tertiary-container";
    return "bg-primary text-on-primary";
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center pt-4 pb-20 px-4 space-y-8">
      {/* Top title info */}
      <div className="text-center space-y-1">
        <h2 className="font-headline text-2xl font-extrabold text-on-surface">Setup Your Game</h2>
        <p className="font-body text-on-surface-variant font-medium text-sm">
          Customize your profile and choose an opponent
        </p>
      </div>

      {/* Profile Setup Section */}
      <section className="w-full flex flex-col items-center space-y-6 bg-surface-container-lowest rounded-3xl p-6 border-2 border-surface-container-highest shadow-soft">
        <h3 className="font-label-caps text-xs text-primary font-bold text-center self-start">
          YOUR PLAYER PROFILE
        </h3>

        {/* Big pulsing active preview */}
        <div className="relative">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-surface-container-high border-4 border-primary p-0.5 shadow-soft overflow-hidden">
            <img
              alt="Selected Avatar Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
              src={profile.avatarUrl}
            />
          </div>
          <Sparkles className="absolute -top-2 -right-2 text-tertiary-fixed fill-current w-6 h-6 animate-pulse" />
        </div>

        {/* Input box */}
        <div className="w-full max-w-xs relative">
          <input
            id="player-name-input"
            type="text"
            className="w-full bg-surface border-2 border-primary rounded-none py-3 px-6 pr-12 text-center font-body font-bold text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-white focus:ring-2 focus:ring-primary/20 transition-all shadow-[4px_4px_0px_0px_#f27d26]"
            placeholder="Type your nickname..."
            value={profile.name}
            onChange={e => setProfile(prev => ({ ...prev, name: e.target.value.slice(0, 15) }))}
          />
          <Edit className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
        </div>

        {/* Dynamic options selection grid */}
        <div className="w-full">
          <p className="font-label-caps text-[10px] text-on-surface-variant/75 text-center mb-3">
            SELECT AVATAR
          </p>
          <div className="grid grid-cols-6 gap-2 md:gap-3">
            {AVATAR_OPTIONS.map(item => {
              const works = profile.avatarUrl === item.url;
              return (
                <button
                  key={item.name}
                  onClick={() => handleSelectAvatar(item.url)}
                  className={`relative aspect-square rounded-2xl bg-surface border-2 overflow-hidden transition-all duration-150 transform hover:scale-105 active:scale-95 ${
                    works ? "border-primary" : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <img
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    src={item.url}
                  />
                  {works && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <span className="bg-primary text-on-primary rounded-full p-1 shadow-sm">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  )}
                </button>
              );
            })}

            {/* Custom file upload button option */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-square rounded-2xl bg-surface border-2 border-dashed border-outline-variant hover:border-primary flex flex-col items-center justify-center transition-all bg-surface-container-low group hover:scale-105"
            >
              <Upload className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
              <span className="text-[8px] font-label-caps text-outline group-hover:text-primary mt-1">
                Upload
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCustomUpload}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Opponent Selection Section */}
      <section className="w-full bg-surface-container-lowest rounded-3xl p-6 border-2 border-surface-container-highest shadow-soft space-y-4">
        <h3 className="font-label-caps text-xs text-primary font-bold self-start">
          SELECT AI OPPONENT
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {opponents.map(bot => {
            const index = selectedBot.id === bot.id;
            return (
              <button
                key={bot.id}
                onClick={() => setSelectedBot(bot)}
                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center space-y-2 cursor-pointer ${currentOpLevelClass(bot)}`}
              >
                <div className="relative">
                  <img
                    alt={bot.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                    src={bot.avatarUrl}
                  />
                  {index && (
                    <span className="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full p-0.5 shadow">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-headline font-bold text-sm text-on-surface">{bot.name}</h4>
                  <span
                    className={`text-[9px] font-label-caps px-2 py-0.5 rounded-full inline-block mt-1 ${getDifficultyColor(bot.difficulty)}`}
                  >
                    {bot.difficulty.toUpperCase()}
                  </span>
                </div>

                <p className="text-[10px] text-on-surface-variant font-body leading-tight">
                  {bot.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Final confirmation Area CTA */}
      <div className="w-full max-w-sm pt-2">
        <motion.button
          onClick={() => onConfirm(profile, selectedBot)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="squish-btn w-full bg-primary text-on-primary font-display-game font-semibold py-3 px-8 rounded-none flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-sm"
        >
          <span>Confirm & Play</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
