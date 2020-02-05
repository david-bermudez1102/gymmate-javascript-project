class ExerciseSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :sets, :repetitions, :complete, :program_id, :video
end
