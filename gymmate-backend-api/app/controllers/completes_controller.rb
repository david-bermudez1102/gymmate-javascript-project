class CompletesController < ApplicationController
  
  before_action :set_user
  before_action :set_workout
  
  def create
    exercise = Exercise.find_by(id: complete_params[:exercise_id])
    complete_exercise  = @workout.completes.build(exercise: exercise, sets: complete_params[:sets])
    if complete_exercise.save
      render json: complete_exercise
    end
  end

  def update
    complete_exercise  = @workout.completes.find_by(id: params[:id], exercise_id: complete_params[:exercise_id])
    if complete_exercise.update(complete_params)
      render json: complete_exercise
    end
  end

  private
    def complete_params
      params.permit(:id, :workout_id, :exercise_id, :sets)
    end

    def set_user
      @user = User.find_by(id: current_user.userable_id)
    end

    def set_workout
      @workout = @user.workouts.find_by(id: complete_params[:workout_id])
    end
end
