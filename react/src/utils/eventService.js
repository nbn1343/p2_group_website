import { supabase } from "./supabase";

export const addEvent = async ({ title, date, time, location, user_id }) => {
    const { data, error } = await supabase.from("events").insert([
        { title, date, time, location, user_id }
    ]);

    if (error) throw new Error(error.message);
    return data;
};
