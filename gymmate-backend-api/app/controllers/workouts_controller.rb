class WorkoutsController < ApplicationController
  before_action :set_user
  
  def create
    workout = @user.workouts.build(workout_params)
    if workout.save
      render json: workout
    end
  end

  def update
    workout = @user.workouts.find_by(id: params[:id])
    if workout.update(workout_params)
      render json: workout
    else
      render json: {errors: workout.errors.full_messages }
    end
  end

  def destroy
    workout = @user.workouts.find_by(id: params[:id])
    if workout.destroy
      render json: workout
    else
      render json: {errors: ["Content could not be deleted"]}
    end
  end

   private
    def workout_params
      params.permit(:program_id, :complete)
    end

    def set_user
      @user = User.find_by(id: current_user.userable_id)
    end
end
