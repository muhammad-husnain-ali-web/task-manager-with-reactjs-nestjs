
    export function dateget(data){
        const res = data.map(i => {
            const date = new Date(i.createdAt);

            const formatted = date.toLocaleString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });

            return {
                ...i,
                createdAt: formatted.replace(",", "")
            };
        })
        return res
    }