import { useState } from "react";

type ContentType = "films" | "series" | "episodes";

export default function AddContentPage() {
    const [type, setType] = useState<ContentType>("films");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [director, setDirector] = useState("");
    const [popularity, setPopularity] = useState(0);
    const [season, setSeason] = useState(1);
    const [episodeTitle, setEpisodeTitle] = useState("");
    const [duration, setDuration] = useState(0);
    const [views, setViews] = useState(0);
    const [image, setImage] = useState("");

    const handleTypeChange = (newType: ContentType) => {
        setType(newType);
        // Réinitialiser uniquement les champs pertinents pour le type
        setTitle("");
        setDescription("");
        setDirector("");
        setPopularity(0);
        setSeason(1);
        setEpisodeTitle("");
        setDuration(0);
        setViews(0);
        setImage("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let payload: any;

        if (type === "films") {
        payload = { title, description, director, popularity, image };
        } else if (type === "series") {
        payload = { title, description, director, popularity, season, image, episodesInfos: [] };
        } else if (type === "episodes") {
        payload = {
            title: episodeTitle,
            duration,
            views,
            serieId: Number(season),
        };

        // On récupère la série correspondante pour ajouter l’épisode automatiquement
        try {
            const serieRes = await fetch(`http://72.61.102.58:3000/series/${season}`);
            if (!serieRes.ok) throw new Error("Série non trouvée");
            const serieData = await serieRes.json();
            serieData.episodesInfos.push({
            id: Date.now(),
            title: episodeTitle,
            duration,
            views,
            serieId: Number(season),
            });

            // Mettre à jour la série avec l’épisode
            await fetch(`http://72.61.102.58:3000/series/${season}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(serieData),
            });
        } catch (error) {
            alert("Erreur lors de l'ajout de l'épisode : " + error);
            return;
        }
        }

        if (type !== "episodes") {
        try {
            const url = `http://72.61.102.58:3000/${type}`;
            const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            });

            if (!res.ok) {
            const text = await res.text();
            alert("Erreur lors de l'ajout : " + text);
            return;
            }
        } catch (error) {
            alert("Erreur lors de l'ajout : " + error);
            return;
        }
        }

        alert("Élément ajouté !");
        // Réinitialiser les champs après succès
        setTitle("");
        setDescription("");
        setDirector("");
        setPopularity(0);
        setSeason(1);
        setEpisodeTitle("");
        setDuration(0);
        setViews(0);
        setImage("");
    };

    return (
        <div className="add-content-page">
        <form onSubmit={handleSubmit} className="add-content-form">
            <h2>Ajouter un contenu</h2>

            <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as ContentType)}
            className="input-field"
            >
            <option value="films">Film</option>
            <option value="series">Série</option>
            <option value="episodes">Épisode</option>
            </select>

            {(type === "films" || type === "series") && (
            <>
                <input
                type="text"
                placeholder="Titre"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                />
                <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                />
                <input
                type="text"
                placeholder="Réalisateur"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                className="input-field"
                />
                <input
                type="text"
                placeholder="URL Image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="input-field"
                />
            </>
            )}

            {type === "series" && (
            <input
                type="number"
                placeholder="Saison"
                value={season}
                onChange={(e) => setSeason(Number(e.target.value))}
                className="input-field"
            />
            )}

            {type === "episodes" && (
            <>
                <input
                type="text"
                placeholder="Titre de l'épisode"
                value={episodeTitle}
                onChange={(e) => setEpisodeTitle(e.target.value)}
                className="input-field"
                />
                <input
                type="number"
                placeholder="Durée (sec)"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="input-field"
                />
                <input
                type="number"
                placeholder="Vues"
                value={views}
                onChange={(e) => setViews(Number(e.target.value))}
                className="input-field"
                />
                <input
                type="number"
                placeholder="ID de la série"
                value={season}
                onChange={(e) => setSeason(Number(e.target.value))}
                className="input-field"
                />
            </>
            )}

            <button type="submit" className="submit-button">
            Ajouter
            </button>
        </form>

        <style>{`
            .add-content-page {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f3f4f6;
            }

            .add-content-form {
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            width: 50%;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            }

            .add-content-form h2 {
            margin-bottom: 1rem;
            }

            .input-field {
            width: 50%;
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 0.25rem;
            margin-bottom: 0.5rem;
            }

            .submit-button {
            padding: 0.5rem 1rem;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.25rem;
            cursor: pointer;
            }

            .submit-button:hover {
            background-color: #2563eb;
            }
        `}</style>
        </div>
    );
}
