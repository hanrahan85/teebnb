
import { supabase } from '@/lib/supabase'
import { TravelData, TravelRecommendation } from '@/types/travel'

export const saveTravelSubmission = async (formData: TravelData, recommendation: TravelRecommendation) => {
  try {
    // First, save the travel submission
    const { data: submission, error: submissionError } = await supabase
      .from('travel_submissions')
      .insert({
        traveler_name: formData.travelerName,
        email: formData.email,
        handicap: formData.handicap,
        budget: formData.budget,
        travel_dates: formData.travelDates,
        group_size: formData.groupSize,
        preferred_region: formData.preferredRegion,
        course_type: formData.courseType,
        accommodation: formData.accommodation,
        duration: formData.duration,
        special_requests: formData.specialRequests
      })
      .select()
      .single()

    if (submissionError) {
      throw submissionError
    }

    // Then, save the AI recommendation
    const { data: recommendationData, error: recommendationError } = await supabase
      .from('travel_recommendations')
      .insert({
        submission_id: submission.id,
        title: recommendation.title,
        summary: recommendation.summary,
        destinations: recommendation.destinations,
        itinerary: recommendation.itinerary,
        practical_info: recommendation.practicalInfo
      })
      .select()
      .single()

    if (recommendationError) {
      throw recommendationError
    }

    return {
      submission,
      recommendation: recommendationData
    }
  } catch (error) {
    console.error('Error saving travel data:', error)
    throw error
  }
}

export const getTravelSubmissions = async () => {
  try {
    const { data, error } = await supabase
      .from('travel_submissions')
      .select(`
        *,
        travel_recommendations (*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching travel submissions:', error)
    throw error
  }
}
