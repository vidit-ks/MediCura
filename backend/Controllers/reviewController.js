import supabase from '../lib/supabase.js'

export const getAllReviews = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, review_text, rating, created_at, users ( id, name, photo )')
      .eq('doctor_id', req.params.doctorId)

    if (error) throw error
    res.status(200).json({ success: true, message: 'Successful', data })
  } catch (err) {
    res.status(404).json({ success: false, message: 'Not found' })
  }
}

export const createReview = async (req, res) => {
  const doctorId = req.body.doctor || req.params.doctorId
  const userId = req.userId

  try {
    // Insert the review
    const { data: savedReview, error } = await supabase
      .from('reviews')
      .insert({
        doctor_id: doctorId,
        user_id: userId,
        review_text: req.body.reviewText,
        rating: req.body.rating
      })
      .select()
      .single()

    if (error) throw error

    // Recalculate average rating for the doctor
    const { data: stats } = await supabase
      .from('reviews')
      .select('rating')
      .eq('doctor_id', doctorId)

    if (stats && stats.length > 0) {
      const total = stats.length
      const avg = stats.reduce((sum, r) => sum + r.rating, 0) / total

      await supabase
        .from('doctors')
        .update({ total_rating: total, average_rating: parseFloat(avg.toFixed(2)) })
        .eq('id', doctorId)
    }

    res.status(200).json({ success: true, message: 'Review Submitted', data: savedReview })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}