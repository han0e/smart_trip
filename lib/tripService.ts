import { supabase } from "@/lib/supabase";
import { DayItinerary, CostItem } from "@/types/itinerary";

export const saveTripToSupabase = async (tripId: string, itinerary: DayItinerary[], costs: CostItem[]) => {
  // 1. Update costs
  const { error: costError } = await supabase
    .from('costs')
    .delete()
    .eq('trip_id', tripId);
    
  if (!costError) {
    await supabase.from('costs').insert(
      costs.map((c, i) => ({ ...c, trip_id: tripId, order_index: i }))
    );
  }

  // 2. Update itinerary (complex because of nested structure)
  // This is a simplified version - in a real app you'd want a more robust sync
  for (const day of itinerary) {
    const { data: dayData, error: dayError } = await supabase
      .from('itinerary_days')
      .upsert({ 
        trip_id: tripId, 
        day_number: parseInt(day.id.replace('day', '')),
        title: day.title,
        date_str: day.date
      })
      .select()
      .single();

    if (dayData) {
      await supabase.from('itinerary_items').delete().eq('day_id', dayData.id);
      await supabase.from('itinerary_items').insert(
        day.schedules.map((s, i) => ({
          day_id: dayData.id,
          time: s.time,
          title: s.title,
          description: s.desc,
          icon_name: s.iconName,
          travel_time: s.travelTime,
          map_query: s.mapQuery,
          order_index: i
        }))
      );
    }
  }
};
