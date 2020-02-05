class CompletesController < ApplicationController
  def create
    user = User.find_by(id: current_user.userable_id)
    workout = user.workouts.find_by(id: complete_params[:workout_id])
    exercise = Exercise.find_by(id: complete_params[:exercise_id])
    complete_exercise  = workout.completes.build(exercise: exercise)
    if complete_exercise.save
      render json: complete_exercise
    end
  end

  private
    def complete_params
      params.permit(:workout_id, :exercise_id)
    end
end
