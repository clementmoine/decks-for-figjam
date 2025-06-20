import { z } from "zod";
import { useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, FileText, Download, Upload, Check } from "lucide-react";

// 1. Define Zod schema
const cardSchema = z.object({
  value: z.string().min(1, "Valeur requise"),
  figure: z.string().optional(),
});
const deckSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  logo: z.string(),
  front: z.string(),
  back: z.string(),
  showName: z.boolean().optional(),
  description: z.string().optional(),
  cards: z.array(cardSchema),
});
type DeckForm = z.infer<typeof deckSchema>;

const FIGMA_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 200 300" width="1667" height="2500"><style type="text/css">.st0{fill:#0acf83}.st1{fill:#a259ff}.st2{fill:#f24e1e}.st3{fill:#ff7262}.st4{fill:#1abcfe}</style><title>Figma.logo</title><desc>Created using Figma</desc><path id="path0_fill" class="st0" d="M50 300c27.6 0 50-22.4 50-50v-50H50c-27.6 0-50 22.4-50 50s22.4 50 50 50z"/><path id="path1_fill" class="st1" d="M0 150c0-27.6 22.4-50 50-50h50v100H50c-27.6 0-50-22.4-50-50z"/><path id="path1_fill_1_" class="st2" d="M0 50C0 22.4 22.4 0 50 0h50v100H50C22.4 100 0 77.6 0 50z"/><path id="path2_fill" class="st3" d="M100 0h50c27.6 0 50 22.4 50 50s-22.4 50-50 50h-50V0z"/><path id="path3_fill" class="st4" d="M200 150c0 27.6-22.4 50-50 50s-50-22.4-50-50 22.4-50 50-50 50 22.4 50 50z"/></svg>`;

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<DeckForm>({
    resolver: zodResolver(deckSchema),
    defaultValues: {
      name: "Deck",
      logo: FIGMA_LOGO,
      front: "#f8fafc",
      back: "#64748b",
      showName: true,
      description: "Cartes",
      cards: [{ value: "Carte 1" }, { value: "Carte 2" }],
    },
  });

  useEffect(() => {
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;

      if (msg?.type === "init" && msg.deck) {
        reset(msg.deck);
      }
    };
  }, [reset]);

  // 3. Manage cards array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "cards",
  });

  // 4. Submit handler
  const onSubmit = (data: DeckForm) => {
    parent.postMessage(
      { pluginMessage: { type: "submit", deck: { id: "CUSTOM", ...data } } },
      "*"
    );
  };

  // Export deck to JSON
  const exportDeck = () => {
    const currentData = getValues();
    const dataStr = JSON.stringify(currentData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentData.name || "deck"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import deck from JSON
  const importDeck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);

        // Validate the imported data against our schema
        const validatedData = deckSchema.parse(jsonData);
        reset(validatedData);

        // Show success feedback
        const button = event.target.closest("button");
        if (button) {
          const originalHTML = button.innerHTML;
          button.innerHTML =
            '<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Importé !';
          setTimeout(() => {
            button.innerHTML = originalHTML;
          }, 2000);
        }
      } catch (error) {
        alert(
          "Erreur lors de l'importation du fichier JSON. Vérifiez le format."
        );
        console.error("Import error:", error);
      }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-6xl mx-auto p-6">
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Créateur de Deck
            </h1>
            <p className="text-gray-600">Créez et personnalisez vos cartes</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Informations générales */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Informations générales
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du deck
                    </label>
                    <input
                      type="text"
                      {...register("name")}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                      placeholder="Mon deck"
                    />
                    {errors.name && (
                      <span className="text-red-500 text-xs">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <input
                    type="checkbox"
                    id="showName"
                    {...register("showName")}
                    className="w-4 h-4 text-gray-600 rounded focus:ring-gray-500"
                  />
                  <label htmlFor="showName" className="text-sm text-gray-700">
                    Afficher le titre sur les cartes
                  </label>
                </div>
              </div>

              {/* Couleurs */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Couleurs
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur dos
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        {...register("back")}
                        className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur face
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        {...register("front")}
                        className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo SVG
                  </label>
                  <textarea
                    rows={3}
                    {...register("logo")}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors resize-none text-sm"
                    placeholder="<svg>...</svg>"
                  />
                </div>
              </div>

              {/* Cartes */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Cartes ({fields.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        value: `Carte ${fields.length + 1}`,
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>

                <div className="space-y-4">
                  {fields.map((card, i) => (
                    <div
                      key={card.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-gray-800">
                          Carte {i + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() => remove(i)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Valeur
                          </label>
                          <input
                            type="text"
                            {...register(`cards.${i}.value`)}
                            placeholder="A, K, Q, J..."
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Figure (SVG)
                          </label>
                          <textarea
                            rows={2}
                            {...register(`cards.${i}.figure`)}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors resize-none text-sm"
                            placeholder="<svg>...</svg>"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {fields.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Aucune carte</p>
                      <p className="text-sm">
                        Cliquez sur "Ajouter" pour commencer
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importDeck}
        className="hidden"
      />

      {/* Floating Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-row gap-3 justify-center items-center">
            <button
              type="button"
              onClick={triggerFileInput}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-w-[140px] justify-center"
            >
              <Upload className="w-4 h-4" />
              Importer
            </button>

            <button
              type="button"
              onClick={exportDeck}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors min-w-[140px] justify-center"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>

            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors min-w-[140px] justify-center font-medium"
            >
              <Check className="w-4 h-4" />
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
