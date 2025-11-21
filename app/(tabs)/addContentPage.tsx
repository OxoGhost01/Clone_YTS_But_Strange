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
            <h2 className="title">Ajouter un contenu</h2>

            <div className="form-group">
                <label>Type de contenu</label>
                <select
                    value={type}
                    onChange={(e) => handleTypeChange(e.target.value as ContentType)}
                    className="input-field"
                >
                    <option value="films">Film</option>
                    <option value="series">Série</option>
                    <option value="episodes">Épisode</option>
                </select>
            </div>

            {(type === "films" || type === "series") && (
                <>
                    <div className="form-group">
                        <label>Titre</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label>Réalisateur</label>
                        <input
                            type="text"
                            value={director}
                            onChange={(e) => setDirector(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label>URL Image</label>
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="input-field"
                        />
                    </div>
                </>
            )}

            {type === "series" && (
                <div className="form-group">
                    <label>Saison</label>
                    <input
                        type="number"
                        value={season}
                        onChange={(e) => setSeason(Number(e.target.value))}
                        className="input-field"
                    />
                </div>
            )}

            {type === "episodes" && (
                <>
                    <div className="form-group">
                        <label>Titre de l'épisode</label>
                        <input
                            type="text"
                            value={episodeTitle}
                            onChange={(e) => setEpisodeTitle(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label>Durée (sec)</label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label>Vues</label>
                        <input
                            type="number"
                            value={views}
                            onChange={(e) => setViews(Number(e.target.value))}
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label>ID de la série</label>
                        <input
                            type="number"
                            value={season}
                            onChange={(e) => setSeason(Number(e.target.value))}
                            className="input-field"
                        />
                    </div>
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
                background: linear-gradient(135deg, #0f172a, #1e293b);
                padding: 2rem;
                color: white;
            }

            .add-content-form {
                width: 420px;
                backdrop-filter: blur(18px);
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 1rem;
                padding: 2rem;
                display: flex;
                flex-direction: column;
                gap: 1.2rem;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            }

            .title {
                font-size: 1.8rem;
                text-align: center;
                margin-bottom: 0.5rem;
                font-weight: 600;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 0.3rem;
                width: 100%;
            }

            .form-group label {
                font-size: 0.9rem;
                opacity: 0.8;
            }

            .input-field {
                padding: 0.7rem 0.8rem;
                background: rgba(255, 255, 255, 0.15);
                border: none;
                border-radius: 0.4rem;
                color: white;
                font-size: 1rem;
                outline: none;
                transition: 0.2s ease;
            }

            .input-field::placeholder {
                color: rgba(255,255,255,0.4);
            }

            .input-field:focus {
                background: rgba(255,255,255,0.25);
            }

            .submit-button {
                margin-top: 1rem;
                padding: 0.8rem;
                background: #3b82f6;
                border: none;
                border-radius: 0.5rem;
                font-size: 1.1rem;
                color: white;
                cursor: pointer;
                transition: 0.2s ease;
            }

            .submit-button:hover {
                background: #2563eb;
            }

        `}</style>
    </div>
)};